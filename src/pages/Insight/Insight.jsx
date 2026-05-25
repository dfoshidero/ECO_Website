import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaSyncAlt, FaChevronDown, FaCheck } from "react-icons/fa";
import { extract, predict } from "../../utils/modelapi";
import {
  loadSession,
  saveSession,
  createSessionItem,
  getGreeting,
  getCoverage,
  formatCoveragePercent,
  getFeatureChips,
} from "../../utils/sessionHistory";
import BriefEditor from "../../components/BriefEditor/BriefEditor";
import RibaScale from "../../components/RibaScale/RibaScale";
import ScrapBoard from "../../components/ScrapBoard/ScrapBoard";
import { Button, Card } from "../../components/ui";
import {
  insightExamples,
} from "../../data/examples";
import { getInsightModelOptions } from "../../data/docs";
import { useTheme } from "../../context/ThemeContext";
import "./InsightPage.scss";

const SESSION_PREVIEW_COUNT = 6;

const MODELS = getInsightModelOptions();

const RESET_DRIFT_THRESHOLD = 5;

const getRandomExamples = (arr, num) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, num);
};

const Insight = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const autoRunDone = useRef(false);
  const requestIdRef = useRef(0);
  const lastPredictedTextRef = useRef("");
  const logoSrc = `${process.env.PUBLIC_URL}/assets/images/${
    theme === "dark" ? "logo-white.png" : "logo-dark.png"
  }`;

  const [description, setDescription] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [extractedData, setExtractedData] = useState({});
  const [coverage, setCoverage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [randomExamples, setRandomExamples] = useState(
    () => getRandomExamples(insightExamples, 2)
  );
  const [session, setSession] = useState(loadSession);
  const [activeId, setActiveId] = useState(null);
  const [showAllSessions, setShowAllSessions] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState(MODELS[0].id);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const modelPickerRef = useRef(null);

  const selectedModel =
    MODELS.find((m) => m.id === selectedModelId) || MODELS[0];

  useEffect(() => {
    if (!isModelMenuOpen) return undefined;
    const onDocClick = (e) => {
      if (
        modelPickerRef.current &&
        !modelPickerRef.current.contains(e.target)
      ) {
        setIsModelMenuOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setIsModelMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [isModelMenuOpen]);

  const greeting = getGreeting();

  useEffect(() => {
    saveSession(session);
  }, [session]);

  const runPrediction = useCallback(async (text) => {
    const trimmed = String(text).trim();
    if (!trimmed) {
      setError("Please enter a building description.");
      return;
    }

    const myId = ++requestIdRef.current;
    setPrediction(null);
    setError("");
    setCoverage(null);
    setIsLoading(true);

    try {
      const extracted = await extract(trimmed);
      if (requestIdRef.current !== myId) return;
      setExtractedData(extracted);
      const result = await predict(extracted);
      if (requestIdRef.current !== myId) return;
      const value = parseFloat(result[0]).toFixed(2);
      setPrediction(value);

      const coverageResult = getCoverage(extracted);
      setCoverage(coverageResult);
      lastPredictedTextRef.current = trimmed;

      const item = createSessionItem({
        description: trimmed,
        prediction: value,
        extractedData: extracted,
        coverage: coverageResult,
      });
      setSession((prev) => [item, ...prev].slice(0, 20));
      setActiveId(item.id);
    } catch (err) {
      if (requestIdRef.current !== myId) return;
      console.error("Prediction error:", err);
      setError(
        "Could not reach the prediction API. Check your connection and try again."
      );
    } finally {
      if (requestIdRef.current === myId) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const { description: prefill, autoRun } = location.state || {};
    if (prefill && !autoRunDone.current) {
      setDescription(prefill);
      if (autoRun) {
        autoRunDone.current = true;
        runPrediction(prefill);
      }
    }
  }, [location.state, runPrediction]);

  const handlePredict = () => runPrediction(description);

  const handleDescriptionChange = useCallback(
    (next) => {
      setDescription(next);
      setError("");

      if (prediction === null && !isLoading) return;

      const baseline = lastPredictedTextRef.current;
      const drift = Math.abs(next.length - baseline.length);
      const cleared = next.trim() === "";

      if (cleared || drift >= RESET_DRIFT_THRESHOLD) {
        requestIdRef.current += 1;
        setPrediction(null);
        setExtractedData({});
        setCoverage(null);
        setActiveId(null);
        setIsLoading(false);
      }
    },
    [prediction, isLoading]
  );

  const handleExampleClick = (input) => {
    setDescription(input);
    runPrediction(input);
  };

  const shuffleRandomExamples = () => {
    setRandomExamples((current) => {
      let next = getRandomExamples(insightExamples, 2);
      if (
        next.length === current.length &&
        next.every((example, i) => example.title === current[i]?.title)
      ) {
        next = getRandomExamples(insightExamples, 2);
      }
      return next;
    });
  };

  const handleFocus = () => {
    setRandomExamples(getRandomExamples(insightExamples, 2));
  };

  const handleSessionSelect = (item) => {
    setDescription(item.description);
    setPrediction(item.prediction);
    setExtractedData(item.extractedData);
    setCoverage(
      item.coverage ?? getCoverage(item.extractedData)
    );
    setActiveId(item.id);
    setError("");
    lastPredictedTextRef.current = item.description;
  };

  const clearSession = () => {
    setSession([]);
    setActiveId(null);
    sessionStorage.removeItem("eco-insight-session");
  };

  const handleDetails = () => {
    navigate("/project", {
      state: {
        extractedData,
        input: description,
        prediction,
      },
    });
  };

  const chips = getFeatureChips(extractedData);

  return (
    <div className="insight">
      <div className="insight__topbar">
        <div
          className={`insight__model-picker ${
            isModelMenuOpen ? "is-open" : ""
          }`}
          ref={modelPickerRef}
        >
          <button
            type="button"
            className="insight__model-picker-button"
            onClick={() => setIsModelMenuOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={isModelMenuOpen}
            title="Choose model"
          >
            <span className="insight__model-picker-label">
              {selectedModel.label}
            </span>
            <FaChevronDown className="insight__model-picker-caret" />
          </button>
          {isModelMenuOpen && (
            <div className="insight__model-menu" role="listbox">
              {MODELS.map((model) => {
                const isSelected = model.id === selectedModelId;
                return (
                  <button
                    key={model.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`insight__model-option ${
                      isSelected ? "is-selected" : ""
                    }`}
                    disabled={!model.available}
                    onClick={() => {
                      setSelectedModelId(model.id);
                      setIsModelMenuOpen(false);
                    }}
                  >
                    <span className="insight__model-option-main">
                      <span className="insight__model-option-label">
                        {model.label}
                      </span>
                      <span className="insight__model-option-desc">
                        {model.description}
                      </span>
                    </span>
                    {isSelected && (
                      <FaCheck className="insight__model-option-check" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <header className="insight__header">
        <img src={logoSrc} alt="" className="insight__logo" />
        <div>
          <h1 className="insight__greeting">{greeting}</h1>
          <p className="insight__hint">
            Describe a building — ECO extracts what it can and predicts embodied
            carbon for those elements. The more detail you give, the more
            accurate the estimate.
          </p>
          <br />
          <p className="insight__hint">
            Not a chatbot; each entry is an independent prediction.
          </p>
        </div>
      </header>

      <div className="insight__workspace">
        <div className="insight__main">
          <Card padding="md" className="insight__input-card">
            <BriefEditor
              value={description}
              onChange={handleDescriptionChange}
              onFocus={handleFocus}
              onSubmit={handlePredict}
              placeholder={[
                "# building size, type, facade?",
                "# structure and roof materials?",
                "# anything unusual — glazing, foundations?",
              ]}
              ariaLabel="Building description"
            />

            {error && (
              <div className="insight__error" role="alert">
                {error}
              </div>
            )}

            <div className="insight__actions">
              <Button
                variant="primary"
                size="md"
                onClick={handlePredict}
                disabled={isLoading}
              >
                {isLoading ? "Predicting…" : "Predict carbon"}
              </Button>
              <span className="insight__shortcut">⌘/Ctrl + Enter</span>
            </div>

            {prediction && !isLoading && (
              <div className="insight__result">
                <div className="insight__result-value">
                  <span className="insight__result-number">{prediction}</span>
                  <span className="insight__result-unit">
                    kgCO₂e/m<sup>2</sup>
                  </span>
                </div>

                <RibaScale
                  value={prediction}
                  extracted={extractedData}
                  description={description}
                />

                {coverage && (
                  <>
                    <p className="insight__coverage">
                      {coverage.valid} of {coverage.total} fields detected (
                      {formatCoveragePercent(coverage.ratio)}%)
                    </p>
                    {coverage.level === "low" && (
                      <p
                        className="insight__coverage-note insight__coverage-note--low"
                        role="status"
                      >
                        <strong>Low coverage.</strong> ECO only picked up{" "}
                        {coverage.valid} of {coverage.total} details from your
                        description. Predictions get more accurate as your
                        description gets longer.
                      </p>
                    )}
                    {coverage.level === "partial" && (
                      <p
                        className="insight__coverage-note insight__coverage-note--partial"
                        role="status"
                      >
                        Add more detail for a sharper estimate.
                      </p>
                    )}
                  </>
                )}
                {chips.length > 0 && (
                  <div className="insight__chips">
                    {chips.map(({ key, value }) => (
                      <span key={key} className="insight__chip">
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                )}
                <Button variant="secondary" size="sm" onClick={handleDetails}>
                  {coverage?.level !== "good"
                    ? "Add missing details →"
                    : "See full details →"}
                </Button>
              </div>
            )}
          </Card>

          {description === "" && (
            <div className="insight__examples">
              <p className="insight__examples-label">Try an example</p>
              <div className="insight__examples-row">
                <div className="insight__example-cards">
                  {randomExamples.map((example) => (
                    <button
                      key={example.title}
                      type="button"
                      className="insight__example-card"
                      onClick={() => handleExampleClick(example.brief)}
                    >
                      <span className="insight__example-title">
                        {example.title}
                      </span>
                      <span className="insight__example-brief">
                        {example.brief}
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="insight__examples-shuffle"
                  onClick={shuffleRandomExamples}
                  aria-label="Shuffle examples"
                  title="Shuffle examples"
                >
                  <FaSyncAlt />
                </button>
              </div>
            </div>
          )}
        </div>

        <section className="insight__rail insight__rail--horizontal">
          <div className="insight__rail-header">
            <h2>Session</h2>
            {session.length > 0 && (
              <button
                type="button"
                className="insight__clear"
                onClick={clearSession}
              >
                Clear
              </button>
            )}
            <Link to="/support" className="insight__rail-link">
              How Talking Carbon works →
            </Link>
          </div>
          {session.length === 0 ? (
            <p className="insight__rail-empty">
              Predictions from this session appear here.
            </p>
          ) : (
            <>
              <ScrapBoard
                items={
                  showAllSessions
                    ? session
                    : session.slice(0, SESSION_PREVIEW_COUNT)
                }
                activeId={activeId}
                onSelect={handleSessionSelect}
              />
              {session.length > SESSION_PREVIEW_COUNT && (
                <div className="insight__rail-footer">
                  <button
                    type="button"
                    className="insight__rail-toggle"
                    onClick={() => setShowAllSessions((v) => !v)}
                  >
                    {showAllSessions
                      ? "Show fewer"
                      : `Show all (${session.length})`}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Insight;
