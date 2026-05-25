import React, { useState } from "react";
import { currentTrack, docsTracks } from "../../data/docs";
import "./SupportPage.scss";

const SupportPage = () => {
  const [activeTrackId, setActiveTrackId] = useState(currentTrack.id);
  const [docsView, setDocsView] = useState("overview");

  const track =
    docsTracks.find((t) => t.id === activeTrackId) ?? currentTrack;

  const isComingSoon = track.status === "comingSoon";
  const changelog = track.changelog ?? [];
  const showChangelogToggle = !isComingSoon && changelog.length > 0;
  const showOverview = docsView === "overview" && !isComingSoon;
  const showChangelog = docsView === "changelog" && showChangelogToggle;

  const handleTrackChange = (trackId) => {
    setActiveTrackId(trackId);
    const next = docsTracks.find((t) => t.id === trackId);
    if (next?.status === "comingSoon") {
      setDocsView("overview");
    }
  };

  const stageLabel = track.currentPatch
    ? `${track.label} ${track.currentPatch} · Early access`
    : `${track.label} · Coming soon`;

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

      <div className="docs__version-tabs" role="tablist" aria-label="Version">
        {docsTracks.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={activeTrackId === t.id}
            className={`docs__version-tab ${
              activeTrackId === t.id ? "active" : ""
            }`}
            onClick={() => handleTrackChange(t.id)}
          >
            {t.label}
            {t.status === "current" && (
              <span className="docs__version-badge">Current</span>
            )}
            {t.status === "comingSoon" && (
              <span className="docs__version-badge docs__version-badge--muted">
                Coming soon
              </span>
            )}
          </button>
        ))}
      </div>

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
        <p>{track.summary}</p>
        {track.releasedAt && (
          <span className="docs__released">Released {track.releasedAt}</span>
        )}
        {track.variants && track.variants.length > 0 && showOverview && (
          <div className="docs__variants" aria-label="Model variants">
            {track.variants.map((variant) => (
              <span
                key={variant.id}
                className={`docs__variant-chip ${
                  variant.status === "comingSoon"
                    ? "docs__variant-chip--soon"
                    : ""
                }`}
                title={variant.description}
              >
                {variant.label}
                {variant.status === "current" && (
                  <span className="docs__variant-chip-badge">Active</span>
                )}
                {variant.status === "comingSoon" && (
                  <span className="docs__variant-chip-badge docs__variant-chip-badge--muted">
                    Coming soon
                  </span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      {isComingSoon && (
        <div className="docs__coming-soon">
          <p className="docs__coming-soon-label">Planned for {track.label}</p>
          <div className="docs__section-body">{track.preview}</div>
          <p className="docs__coming-soon-back">
            <button
              type="button"
              className="docs__coming-soon-link"
              onClick={() => handleTrackChange(currentTrack.id)}
            >
              ← Back to {currentTrack.label} documentation
            </button>
          </p>
        </div>
      )}

      {showOverview && (
        <div className="docs__layout">
          <nav className="docs__nav" aria-label="Section navigation">
            {track.sections.map(({ id, title }) => (
              <a key={id} href={`#${id}`} className="docs__nav-link">
                {title}
              </a>
            ))}
          </nav>

          <div className="docs__content">
            {track.sections.map(({ id, title, content }) => (
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
          <h2 className="docs__changelog-title">What&apos;s new in {track.label}</h2>
          <ul className="docs-changelog">
            {changelog.map((entry) => (
              <li key={entry.version} className="docs-changelog__entry">
                <div className="docs-changelog__header">
                  <span className="docs-changelog__version">{entry.version}</span>
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
