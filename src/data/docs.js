import React from "react";

export const paperUrl =
  "https://www.tandfonline.com/doi/full/10.1080/17452007.2026.2613773";

export const docsVersions = [
  {
    id: "v1",
    label: "v1",
    status: "current",
    releasedAt: "2024",
    summary:
      "Initial release. Synthetic-data trained HistGradBoost model with NLP feature extraction for early-stage embodied carbon prediction.",
    sections: [
      {
        id: "introduction",
        title: "Introduction",
        content: (
          <>
            <p>
              ECO — an Early-stage Carbon Impact Observer — turns natural-language
              building descriptions into embodied carbon estimates at concept stage.
              It closes the gap between early design sketches and whole-building
              carbon grounding by translating text into material masses and
              kgCO₂e/m² predictions.
            </p>
            <p>
              Carbon awareness is now expected from the first design conversation.
              ECO gives architects and sustainability teams immediate feedback on
              carbon implications before detailed models exist — so decisions stay
              informed from the outset.
            </p>
          </>
        ),
      },
      {
        id: "how-it-works",
        title: "How it works",
        content: (
          <>
            <p>
              v1 uses 150,000 synthetic datapoints generated from pre-existing
              carbon calculators. Synthetic data bridges the gap for whole-building
              carbon prediction when only an early outline exists.
            </p>
            <p>
              Calculators employ carbon factors from the Inventory of Carbon and
              Energy (ICE) database and Environmental Product Declarations (EPDs).
            </p>
            <div className="docs-pipeline">
              <span>Initial text description</span>
              <span className="docs-pipeline__arrow">↓</span>
              <span>
                Feature extraction (SpaCy NER + Sentence Transformers)
              </span>
              <span className="docs-pipeline__arrow">↓</span>
              <span>Histogram-based Gradient Boosting regression</span>
              <span className="docs-pipeline__arrow">↓</span>
              <span>Embodied carbon prediction (kgCO₂e/m²)</span>
            </div>
            <p>
              The regression model achieves approximately 95% accuracy across
              multiple tests. Intelligent learning at the conceptualisation stage
              can transform how teams reason about carbon footprint before
              commitments harden.
            </p>
          </>
        ),
      },
      {
        id: "inputs-outputs",
        title: "Inputs and outputs",
        content: (
          <>
            <p>
              <strong>Inputs</strong>
            </p>
            <ul>
              <li>
                Free-text description of an early-stage building concept (materials,
                structure, dimensions, sector).
              </li>
              <li>
                Optional manual overrides in Full View — sector, sub-sector, material
                selections, and numerical building parameters.
              </li>
            </ul>
            <p>
              <strong>Outputs</strong>
            </p>
            <ul>
              <li>
                Embodied carbon intensity in kgCO₂e/m² (whole-building estimate).
              </li>
              <li>
                Extracted feature set — 30+ material classes, typology, and building
                dimensions ready for export or refinement.
              </li>
              <li>CSV export of description, prediction, and all extracted fields.</li>
            </ul>
          </>
        ),
      },
      {
        id: "capabilities",
        title: "Capabilities",
        content: (
          <ul>
            <li>Building carbon audits with reduction recommendations.</li>
            <li>Real-time carbon predictions in design meetings.</li>
            <li>Design optimisation via inverse predictions for carbon goals.</li>
            <li>
              Integration with operational energy systems for offset forecasting.
            </li>
          </ul>
        ),
      },
      {
        id: "limitations",
        title: "Limitations",
        content: (
          <>
            <p>
              v1 is a proof of concept. Estimates are for preliminary analysis only —
              not final decision-making. Validate with additional tools and
              professional expertise.
            </p>
            <p className="docs-open-issue">
              <strong>Open issue:</strong> The algorithm may favour larger buildings;
              smaller buildings can be over-engineered. Longer descriptions improve
              accuracy.
            </p>
          </>
        ),
      },
      {
        id: "roadmap",
        title: "Roadmap",
        content: (
          <p>
            v2 will expand non-residential coverage and add per-element carbon
            breakdowns. The long-term direction is tighter integration with
            architectural design pipelines — so carbon feedback stays in the tools
            teams already use.
          </p>
        ),
      },
      {
        id: "resources",
        title: "Resources",
        content: (
          <>
            <p>
              <a href={paperUrl} target="_blank" rel="noreferrer">
                Read the published paper
              </a>
            </p>
            <p>
              <a href="/assets/assumptions.xlsx" download>
                Download material assumptions
              </a>
              {" · "}
              <a href="/assets/constraints.xlsx" download>
                Download logical constraints
              </a>
            </p>
          </>
        ),
      },
    ],
  },
];
