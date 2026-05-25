import React from "react";

export const paperUrl =
  "https://www.tandfonline.com/doi/full/10.1080/17452007.2026.2613773";

const eco1Sections = [
  {
    id: "introduction",
    title: "Introduction",
    content: (
      <>
        <p>
          Talking Carbon is the web interface for ECO — an Early-stage Carbon
          Observer that turns natural-language building descriptions into embodied
          carbon estimates at concept stage. ECO closes the gap between early
          design sketches and whole-building carbon grounding by translating text
          into material masses and kgCO₂e/m² predictions.
        </p>
        <p>
          Carbon awareness is now expected from the first design conversation.
          Talking Carbon gives architects and sustainability teams immediate
          feedback on carbon implications before detailed models exist — so
          decisions stay informed from the outset.
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
          ECO 1 uses 150,000 synthetic datapoints generated from pre-existing
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
          <span>Feature extraction (SpaCy NER + Sentence Transformers)</span>
          <span className="docs-pipeline__arrow">↓</span>
          <span>Histogram-based Gradient Boosting regression</span>
          <span className="docs-pipeline__arrow">↓</span>
          <span>Embodied carbon prediction (kgCO₂e/m²)</span>
        </div>
        <p>
          The regression model achieves approximately 95% accuracy across multiple
          tests. Intelligent learning at the conceptualisation stage can transform
          how teams reason about carbon footprint before commitments harden.
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
          <li>Embodied carbon intensity in kgCO₂e/m² (whole-building estimate).</li>
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
          ECO 1 is a proof of concept. Estimates are for preliminary analysis only —
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
        The next generation is ECO 2, focused on LLM-driven extraction and expanded
        real-world training data. Select the ECO 2 tab above for planned improvements
        drawn from published research.
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
];

const eco1StrictPreview = (
  <>
    <p>
      ECO 1 Strict is a stricter extraction profile on the same generation — not a
      separate major version. It targets cases where the standard profile misses
      nuance or resolves conflicts inconsistently.
    </p>
    <h3>Planned improvements</h3>
    <ul>
      <li>
        Semantic parsing for compound numerical phrases such as &ldquo;8-storey
        office&rdquo; or &ldquo;two-storey extension&rdquo; that tokenisation
        splits apart today.
      </li>
      <li>
        Deterministic conflict resolution instead of controlled-random fallbacks
        when incompatible elements are detected (e.g. raft vs pile caps).
      </li>
      <li>
        More stable predictions when the same building is described with different
        wording.
      </li>
    </ul>
  </>
);

const eco2Preview = (
  <>
    <p>
      ECO 2 is planned in two strands: smarter extraction and stronger training data.
      The goal remains early-stage guidance, not final LCA replacement.
    </p>
    <h3>LLM-driven extraction</h3>
    <ul>
      <li>
        LLM-based semantic parsing and entity extraction for compound numerical
        phrases such as &ldquo;8-storey office&rdquo; or &ldquo;two-storey
        extension&rdquo; that the rule-based pipeline tokenises away today.
      </li>
      <li>
        Better detection of secondary elements — pile caps, joisted floors,
        partitions — when not explicitly named in the description.
      </li>
      <li>
        Smarter conflict resolution: probabilistic weighting, construction-practice
        rules, or interactive clarification when the model is ambiguous (e.g. raft
        vs pile caps), replacing controlled-random fallbacks.
      </li>
      <li>
        Reduce linguistic variability impact on predictions so reworded descriptions
        of the same building converge on more stable estimates.
      </li>
    </ul>
    <h3>Expanded training data and calibration</h3>
    <ul>
      <li>
        Retrain on real-world embodied carbon data as it becomes available, reducing
        systematic overprediction observed against benchmark case studies.
      </li>
      <li>
        Interim calibration: per-typology scaling or regression adjustment between
        predicted and benchmarked values until real datasets grow.
      </li>
      <li>
        Finer material granularity — specific grades and mixes rather than generic
        categories such as &ldquo;reinforced concrete&rdquo; or &ldquo;timber&rdquo;.
      </li>
      <li>Broader sector and sub-sector coverage beyond Housing and Office.</li>
      <li>
        Validation across more typologies and scales to establish generalisability
        beyond early proof-of-concept testing (seven case studies in ECO 1).
      </li>
    </ul>
  </>
);

export const ecoPresets = [
  {
    id: "eco-1",
    label: "ECO 1",
    generation: 1,
    profile: "standard",
    status: "current",
    currentVersion: "1.1.1",
    compatibleRange: ">=1.1.1 <2.0.0",
    releasedAt: "May 2026",
    dockerImage: "dfoshidero/eco-embodied-carbon-api",
    dockerTag: "v1.1.1",
    summary:
      "First public release. Synthetic-data trained HistGradBoost model with NLP feature extraction for early-stage embodied carbon prediction.",
    sections: eco1Sections,
    changelog: [
      {
        version: "1.1.1",
        date: "May 2026",
        notes: [
          "First public release of Talking Carbon and the ECO prediction API.",
          "Natural-language extraction (SpaCy NER + Sentence Transformers) and HistGradBoost regression.",
          "Housing and Office sectors with 30+ material classes; CSV export and Full View overrides.",
        ],
      },
    ],
  },
  {
    id: "eco-1-strict",
    label: "ECO 1 Strict",
    generation: 1,
    profile: "strict",
    status: "comingSoon",
    compatibleRange: ">=1.1.1 <2.0.0",
    summary:
      "Stricter extraction profile for ECO 1 — compound numerics, deterministic conflict resolution, and more stable parsing across reworded descriptions.",
    preview: eco1StrictPreview,
  },
  {
    id: "eco-2",
    label: "ECO 2",
    generation: 2,
    profile: "standard",
    status: "comingSoon",
    compatibleRange: ">=2.0.0 <3.0.0",
    summary:
      "LLM-driven extraction and expanded real-world training data for higher semantic accuracy.",
    preview: eco2Preview,
  },
];

export const currentPreset =
  ecoPresets.find((p) => p.status === "current") ?? ecoPresets[0];

export const currentApiVersion = currentPreset.currentVersion ?? "1.1.1";

/** Unique generations in display order */
export const ecoGenerations = [...new Set(ecoPresets.map((p) => p.generation))].sort(
  (a, b) => a - b
);

export function getPresetForGeneration(generation, profile = "standard") {
  return (
    ecoPresets.find(
      (p) => p.generation === generation && p.profile === profile
    ) ?? ecoPresets.find((p) => p.generation === generation)
  );
}

export function getGenerationStatus(generation) {
  const presets = ecoPresets.filter((p) => p.generation === generation);
  if (presets.some((p) => p.status === "current")) return "current";
  return "comingSoon";
}

function profileDescription(preset) {
  if (preset.profile === "strict") return "Strict extraction";
  return "HistGradBoost";
}

function comingSoonTagline(preset) {
  if (preset.id === "eco-2") return "LLM extraction";
  if (preset.profile === "strict") return "Stricter extraction";
  return "Standard";
}

/** Flat list for the Insight model picker */
export function getInsightModelOptions() {
  return ecoPresets.map((p) => ({
    id: p.id,
    label: p.label,
    description:
      p.status === "current"
        ? `${p.currentVersion} · ${profileDescription(p)}`
        : `Coming soon · ${comingSoonTagline(p)}`,
    available: p.status === "current",
    presetId: p.id,
    generation: p.generation,
    profile: p.profile,
  }));
}

export function formatStageLabel(preset) {
  const profile = preset.profile === "strict" ? "Strict" : "Standard";
  const generationLabel = `ECO ${preset.generation}`;

  if (preset.status === "current" && preset.currentVersion) {
    return `${generationLabel} (${preset.currentVersion}) ${profile} · Early access`;
  }
  return `${preset.label} · Coming soon`;
}
