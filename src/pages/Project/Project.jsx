import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { mapExtractedDataToOptions } from "../../utils/utils";
import {
  getCoverage,
  formatCoveragePercent,
} from "../../utils/sessionHistory";
import options from "../../data/options.json";
import { extract, predict } from "../../utils/modelapi";
import { useModal } from "../../context/ModalContext";
import { Button, Card, Tooltip } from "../../components/ui";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { HiChevronDown } from "react-icons/hi2";
import "./Project.scss";

const sectionNames = {
  substructure: "Sub-Structure Materials",
  structure: "Structure Materials",
  external: "External Materials",
  internal: "Internal Materials",
};

const stripMaterial = (name) => name.replace(" Material", "");

const CollapsibleSection = ({ title, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`project-section ${open ? "open" : ""}`}>
      <button
        type="button"
        className="project-section__head"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <HiChevronDown className="project-section__chevron" />
      </button>
      {open && <div className="project-section__body">{children}</div>}
    </div>
  );
};

const Project = () => {
  const location = useLocation();
  const { openGenericModal, closeGenericModal } = useModal();

  const {
    extractedData: initialExtractedData = {},
    input: initialInput = "",
    prediction: initialPrediction = "",
  } = location.state || {};

  const [buildingData, setBuildingData] = useState(initialExtractedData);
  const [description, setDescription] = useState(initialInput);
  const [prediction, setPrediction] = useState(initialPrediction);
  const [loading, setLoading] = useState(false);

  const sector = buildingData["Sector"];

  useEffect(() => {
    if (sector === "Non-residential") {
      setBuildingData((prev) => {
        if (prev["Sub-Sector"] === "Non-residential") return prev;
        return { ...prev, "Sub-Sector": "Non-residential" };
      });
    }
  }, [sector]);

  const mappedData = mapExtractedDataToOptions(buildingData, options);
  const coverage = getCoverage(mappedData);
  const coveragePct = formatCoveragePercent(coverage.ratio);

  const handleDropdownChange = (_category, subcategory, value) => {
    setBuildingData((prev) => ({ ...prev, [subcategory]: value }));
  };

  const handleInputChange = (option, value) => {
    setBuildingData((prev) => ({ ...prev, [option]: value }));
  };

  const recalculate = async () => {
    setLoading(true);
    closeGenericModal();
    try {
      const extractedData = await extract(description);
      setBuildingData(extractedData);
      const predictionValue = await predict(extractedData);
      setPrediction(parseFloat(predictionValue[0]).toFixed(2));
    } catch (error) {
      console.error("Error during recalculate:", error);
      openGenericModal(
        <div>
          <p>Could not recalculate. Check your connection and try again.</p>
          <div className="modal-actions">
            <Button variant="primary" onClick={closeGenericModal}>
              OK
            </Button>
          </div>
        </div>
      );
    }
    setLoading(false);
  };

  const handleRecalculate = async () => {
    const hasChanges =
      JSON.stringify(buildingData) !== JSON.stringify(initialExtractedData);
    const hasData = Object.keys(buildingData).length !== 0;

    if (hasChanges && Object.keys(initialExtractedData).length !== 0) {
      openGenericModal(
        <div>
          <p>
            This will refresh extracted features from your description and you
            will lose manual edits.
          </p>
          <p className="confirm-tip">
            To update only the prediction, use Adjust Prediction.
          </p>
          <div className="modal-actions">
            <Button variant="danger" onClick={recalculate}>
              Yes, refresh
            </Button>
            <Button variant="secondary" onClick={closeGenericModal}>
              Cancel
            </Button>
          </div>
        </div>
      );
    } else if (
      Object.keys(initialExtractedData).length === 0 &&
      hasData
    ) {
      openGenericModal(
        <div>
          <p>This will replace current fields with a new extraction.</p>
          <div className="modal-actions">
            <Button variant="danger" onClick={recalculate}>
              Yes, refresh
            </Button>
            <Button variant="secondary" onClick={closeGenericModal}>
              Cancel
            </Button>
          </div>
        </div>
      );
    } else {
      await recalculate();
    }
  };

  const allFieldsNone = (data) =>
    Object.values(data).every(
      (value) => value === "None" || value === null || value === ""
    );

  const handleCalculate = async () => {
    if (allFieldsNone(buildingData)) {
      openGenericModal(
        <div>
          <p>Please input more data to make a prediction.</p>
          <div className="modal-actions">
            <Button variant="primary" onClick={closeGenericModal}>
              OK
            </Button>
          </div>
        </div>
      );
      return;
    }

    try {
      const predictionValue = await predict(buildingData);
      setPrediction(parseFloat(predictionValue[0]).toFixed(2));
    } catch (error) {
      console.error("Error during calculate:", error);
      openGenericModal(
        <div>
          <p>Prediction failed. Please try again.</p>
          <div className="modal-actions">
            <Button variant="primary" onClick={closeGenericModal}>
              OK
            </Button>
          </div>
        </div>
      );
    }
  };

  const isDisabled = (option) => {
    const constraints = {
      "Raft Foundation Material": [
        "Pile Caps Material",
        "Capping Beams Material",
      ],
      "Pile Caps Material": ["Raft Foundation Material"],
      "Capping Beams Material": ["Raft Foundation Material"],
      "Basement Walls Material": ["Storeys Below Ground"],
      "Floor Slab Material": ["Joisted Floors Material"],
      "Joisted Floors Material": ["Floor Slab Material"],
    };

    if (option === "Basement Walls Material") {
      const storeys = buildingData["Storeys Below Ground"];
      return storeys === 0 || storeys === undefined || storeys === "";
    }

    const disabledOption = constraints[option];
    if (disabledOption) {
      return disabledOption.some(
        (item) => buildingData[item] && buildingData[item] !== "None"
      );
    }

    if (option === "Sub-Sector") {
      return buildingData["Sector"] === "Non-residential";
    }

    return false;
  };

  const getTooltip = (option) => {
    const tooltips = {
      "Raft Foundation Material":
        "Cannot have Raft Foundation with Pile Caps or Capping Beams",
      "Pile Caps Material": "Cannot have Pile Caps with Raft Foundation",
      "Capping Beams Material":
        "Cannot have Capping Beams with Raft Foundation",
      "Basement Walls Material":
        "Cannot have Basement Walls without basement storeys",
      "Floor Slab Material": "Cannot have Floor Slab with Joisted Floors",
      "Joisted Floors Material": "Cannot have Joisted Floors with Floor Slab",
      "Sub-Sector": "Non-residential sub-sectors not yet available",
    };
    return tooltips[option] || "";
  };

  const filteredSubSectorOptions = () => {
    if (buildingData["Sector"] === "Residential") {
      return options.subSectors.options.filter(
        (o) => o !== "Non-residential"
      );
    }
    return options.subSectors.options;
  };

  const filteredJoistedFloorOptions = () => {
    if (buildingData["Sector"] === "Residential") {
      return options.materials.structure.joistedFloors.options.filter(
        (o) => o !== "Timber Joists (Office)"
      );
    }
    if (buildingData["Sector"] === "Non-residential") {
      return options.materials.structure.joistedFloors.options.filter(
        (o) => o !== "Timber Joists (Domestic)"
      );
    }
    return options.materials.structure.joistedFloors.options;
  };

  const renderSelect = (category, subcategory) => {
    const fieldName = options.materials[category][subcategory].name;
    const disabled = loading || isDisabled(fieldName);
    const tooltipText = getTooltip(fieldName);
    const selectOpts =
      subcategory === "joistedFloors"
        ? filteredJoistedFloorOptions()
        : options.materials[category][subcategory].options;

    const selectEl = (
      <select
        className="project-select"
        value={mappedData[fieldName] ?? "None"}
        onChange={(e) =>
          handleDropdownChange(category, fieldName, e.target.value)
        }
        disabled={disabled}
      >
        {selectOpts.map((opt) => (
          <option key={opt} value={opt}>
            {stripMaterial(opt)}
          </option>
        ))}
        <option value="None">None</option>
      </select>
    );

    return (
      <Tooltip content={tooltipText} disabled={disabled && !!tooltipText}>
        {selectEl}
      </Tooltip>
    );
  };

  const handleExport = () => {
    const replaceNullsWithNone = (value) =>
      value === null || value === "" ? "None" : value;

    const extractNecessaryFeatures = (opts) => {
      const features = [];
      const extractFromCategory = (category) => {
        for (const subCategory in category) {
          if (category[subCategory].name) {
            features.push(category[subCategory].name);
          }
        }
      };
      extractFromCategory(opts.materials.substructure);
      extractFromCategory(opts.materials.structure);
      extractFromCategory(opts.materials.external);
      extractFromCategory(opts.materials.internal);
      features.push(opts.sectors.name);
      features.push(opts.subSectors.name);
      features.push(...opts.numericalOptions);
      return features;
    };

    const necessaryFeatures = extractNecessaryFeatures(options);
    const updatedBuildingData = { ...buildingData };
    necessaryFeatures.forEach((feature) => {
      if (!updatedBuildingData.hasOwnProperty(feature)) {
        updatedBuildingData[feature] = "None";
      }
    });

    const dataToExport = [
      { description: "description", value: replaceNullsWithNone(description) },
      {
        description: "prediction",
        value: (prediction ? prediction.toString() : "0") + " kgCO2/m^2",
      },
      { description: "", value: "" },
      ...Object.entries(updatedBuildingData).map(([feature, value]) => ({
        description: feature,
        value: replaceNullsWithNone(value),
      })),
    ];

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const timestamp = new Date().toISOString().replace(/[:.-]/g, "");
    saveAs(blob, `TalkingCarbon_Project${timestamp}.csv`);
  };

  return (
    <div className={`project ${loading ? "is-loading" : ""}`}>
      {loading && (
        <div className="project__overlay" aria-busy="true">
          <div className="project__spinner" />
          <span>Processing…</span>
        </div>
      )}

      <div className="project__hero">
        <Card padding="md" className="project__hero-card">
          <h3>Description</h3>
          <div className="project__desc-row">
            <textarea
              className="project__textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={3}
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRecalculate}
              disabled={loading}
              title="Re-extract from description"
            >
              {description === initialInput && initialInput ? "↻" : "↑"}
            </Button>
          </div>
        </Card>

        <Card padding="md" className="project__hero-card project__hero-prediction">
          <h3>Prediction</h3>
          <div className="project__prediction-row">
            <p className="project__prediction-value">
              {prediction || "—"}{" "}
              <span>kgCO₂e/m<sup>2</sup></span>
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCalculate}
              disabled={loading}
            >
              Adjust prediction
            </Button>
          </div>
          <div
            className={`project__coverage project__coverage--${coverage.level}`}
          >
            <p className="project__coverage-line">
              {coverage.valid} of {coverage.total} fields filled ({coveragePct}%)
            </p>
            {coverage.level === "low" && (
              <p className="project__coverage-note">
                <strong>Low coverage.</strong> Only {coverage.valid} of{" "}
                {coverage.total} details are filled in. Predictions get more
                accurate as you add more.
              </p>
            )}
            {coverage.level === "partial" && (
              <p className="project__coverage-note">
                Add more detail for a sharper prediction.
              </p>
            )}
          </div>
        </Card>

        <Card padding="md" className="project__hero-card project__hero-export">
          <h3>Export</h3>
          <Button variant="secondary" onClick={handleExport} disabled={loading}>
            Export CSV
          </Button>
        </Card>
      </div>

      <div className="project__sections">
        {Object.keys(options.materials).map((category) => (
          <CollapsibleSection
            key={category}
            title={sectionNames[category]}
            defaultOpen
          >
            {Object.keys(options.materials[category]).map((subcategory) => (
              <div key={subcategory} className="project__row">
                <label>
                  {stripMaterial(
                    options.materials[category][subcategory].name
                  )}
                </label>
                {renderSelect(category, subcategory)}
              </div>
            ))}
          </CollapsibleSection>
        ))}

        <CollapsibleSection title="Typology" defaultOpen>
          <div className="project__row">
            <label>{stripMaterial(options.sectors.name)}</label>
            <select
              className="project-select"
              value={mappedData[options.sectors.name] ?? "None"}
              onChange={(e) =>
                handleDropdownChange("sectors", options.sectors.name, e.target.value)
              }
              disabled={loading}
            >
              {options.sectors.options.map((opt) => (
                <option key={opt} value={opt}>
                  {stripMaterial(opt)}
                </option>
              ))}
              <option value="None">None</option>
            </select>
          </div>
          <div className="project__row">
            <label>{stripMaterial(options.subSectors.name)}</label>
            <Tooltip
              content={getTooltip("Sub-Sector")}
              disabled={
                (loading || buildingData["Sector"] === "Non-residential") &&
                !!getTooltip("Sub-Sector")
              }
            >
              <select
                className="project-select"
                value={
                  buildingData["Sector"] === "Non-residential"
                    ? "Non-residential"
                    : mappedData[options.subSectors.name] ?? "None"
                }
                onChange={(e) =>
                  handleDropdownChange(
                    "subSectors",
                    options.subSectors.name,
                    e.target.value
                  )
                }
                disabled={
                  loading || buildingData["Sector"] === "Non-residential"
                }
              >
                {filteredSubSectorOptions().map((opt) => (
                  <option key={opt} value={opt}>
                    {stripMaterial(opt)}
                  </option>
                ))}
                <option value="None">None</option>
              </select>
            </Tooltip>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="General Building Info" defaultOpen>
          {options.numericalOptions.map((option) => (
            <div key={option} className="project__row">
              <label>{stripMaterial(option)}</label>
              <input
                type="number"
                className="project-input"
                value={mappedData[option] ?? ""}
                placeholder="None"
                onChange={(e) => handleInputChange(option, e.target.value)}
                disabled={loading}
              />
            </div>
          ))}
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default Project;
