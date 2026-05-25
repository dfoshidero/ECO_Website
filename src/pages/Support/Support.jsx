import React, { useMemo, useState } from "react";
import {
  currentPreset,
  ecoGenerations,
  formatStageLabel,
  getGenerationStatus,
  getPresetForGeneration,
} from "../../data/docs";
import "./SupportPage.scss";

const SupportPage = () => {
  const [activeGeneration, setActiveGeneration] = useState(currentPreset.generation);
  const [activeProfile, setActiveProfile] = useState("standard");
  const [docsView, setDocsView] = useState("overview");

  const activePreset = useMemo(() => {
    if (activeGeneration === 2) {
      return getPresetForGeneration(2, "standard");
    }
    return getPresetForGeneration(activeGeneration, activeProfile);
  }, [activeGeneration, activeProfile]);

  const isComingSoon = activePreset.status === "comingSoon";
  const changelog = activePreset.changelog ?? [];
  const showChangelogToggle =
    activePreset.status === "current" && changelog.length > 0;
  const showOverview = docsView === "overview" && !isComingSoon;
  const showChangelog = docsView === "changelog" && showChangelogToggle;
  const showProfileToggle = activeGeneration === 1;

  const handleGenerationChange = (generation) => {
    setActiveGeneration(generation);
    if (generation === 2) {
      setActiveProfile("standard");
      setDocsView("overview");
    } else {
      setActiveProfile("standard");
    }
  };

  const handleProfileChange = (profile) => {
    setActiveProfile(profile);
    setDocsView("overview");
  };

  const goToEco1Standard = () => {
    setActiveGeneration(1);
    setActiveProfile("standard");
    setDocsView("overview");
  };

  const stageLabel = formatStageLabel(activePreset);

  return (
    <div className="docs">
      <header className="docs__hero">
        <p className="docs__eyebrow">Embodied carbon prediction toolkit</p>
        <h1>Documentation</h1>
        <p>
          What Talking Carbon does, how it works, and where it&apos;s headed.
        </p>
        <dl className="docs__meta">
          <div>
            <dt>Stage</dt>
            <dd>{stageLabel}</dd>
          </div>
          <div>
            <dt>Built by</dt>
            <dd>Daniel Favour O. Oshidero</dd>
          </div>
          <div>
            <dt>Origin</dt>
            <dd>Spun out of research at the University of Bath, 2024</dd>
          </div>
        </dl>
      </header>

      <div className="docs__version-tabs" role="tablist" aria-label="Generation">
        {ecoGenerations.map((gen) => {
          const status = getGenerationStatus(gen);
          return (
            <button
              key={gen}
              type="button"
              role="tab"
              aria-selected={activeGeneration === gen}
              className={`docs__version-tab ${
                activeGeneration === gen ? "active" : ""
              }`}
              onClick={() => handleGenerationChange(gen)}
            >
              ECO {gen}
              {status === "current" && (
                <span className="docs__version-badge">Current</span>
              )}
              {status === "comingSoon" && (
                <span className="docs__version-badge docs__version-badge--muted">
                  Coming soon
                </span>
              )}
            </button>
          );
        })}
      </div>

      {showProfileToggle && (
        <div
          className="docs__view-toggle docs__profile-toggle"
          role="tablist"
          aria-label="Extraction profile"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeProfile === "standard"}
            className={`docs__view-tab ${
              activeProfile === "standard" ? "active" : ""
            }`}
            onClick={() => handleProfileChange("standard")}
          >
            Standard
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeProfile === "strict"}
            className={`docs__view-tab docs__view-tab--soon ${
              activeProfile === "strict" ? "active" : ""
            }`}
            onClick={() => handleProfileChange("strict")}
          >
            Strict
            <span className="docs__view-tab-hint">Coming soon</span>
          </button>
        </div>
      )}

      {showChangelogToggle && (
        <div
          className="docs__view-toggle"
          role="tablist"
          aria-label="Documentation view"
        >
          <button
            type="button"
            role="tab"
            aria-selected={docsView === "overview"}
            className={`docs__view-tab ${
              docsView === "overview" ? "active" : ""
            }`}
            onClick={() => setDocsView("overview")}
          >
            Overview
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={docsView === "changelog"}
            className={`docs__view-tab ${
              docsView === "changelog" ? "active" : ""
            }`}
            onClick={() => setDocsView("changelog")}
          >
            What&apos;s new
          </button>
        </div>
      )}

      <div className="docs__version-intro">
        <p>{activePreset.summary}</p>
        {activePreset.releasedAt && (
          <span className="docs__released">
            Released {activePreset.releasedAt}
          </span>
        )}
      </div>

      {isComingSoon && (
        <div className="docs__coming-soon">
          <p className="docs__coming-soon-label">
            Planned for {activePreset.label}
          </p>
          <div className="docs__section-body">{activePreset.preview}</div>
          <p className="docs__coming-soon-back">
            <button
              type="button"
              className="docs__coming-soon-link"
              onClick={goToEco1Standard}
            >
              ← Back to ECO 1 documentation
            </button>
          </p>
        </div>
      )}

      {showOverview && (
        <div className="docs__layout">
          <nav className="docs__nav" aria-label="Section navigation">
            {activePreset.sections.map(({ id, title }) => (
              <a key={id} href={`#${id}`} className="docs__nav-link">
                {title}
              </a>
            ))}
          </nav>

          <div className="docs__content">
            {activePreset.sections.map(({ id, title, content }) => (
              <section key={id} id={id} className="docs__section">
                <h2>{title}</h2>
                <div className="docs__section-body">{content}</div>
              </section>
            ))}
          </div>
        </div>
      )}

      {showChangelog && (
        <div className="docs__changelog-panel">
          <h2 className="docs__changelog-title">
            What&apos;s new in ECO {activePreset.generation}
          </h2>
          <ul className="docs-changelog">
            {changelog.map((entry) => (
              <li key={entry.version} className="docs-changelog__entry">
                <div className="docs-changelog__header">
                  <span className="docs-changelog__version">
                    {entry.version}
                  </span>
                  <time className="docs-changelog__date">{entry.date}</time>
                </div>
                <ul className="docs-changelog__notes">
                  {entry.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SupportPage;
