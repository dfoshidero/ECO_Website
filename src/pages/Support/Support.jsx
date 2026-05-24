import React, { useState } from "react";
import { docsVersions } from "../../data/docs";
import "./SupportPage.scss";

const SupportPage = () => {
  const [activeVersionId, setActiveVersionId] = useState(docsVersions[0].id);
  const version =
    docsVersions.find((v) => v.id === activeVersionId) || docsVersions[0];

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
            <dd>v1 · Early access</dd>
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

      <div className="docs__version-tabs" role="tablist">
        {docsVersions.map((v) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={activeVersionId === v.id}
            className={`docs__version-tab ${
              activeVersionId === v.id ? "active" : ""
            }`}
            onClick={() => setActiveVersionId(v.id)}
          >
            {v.label}
            {v.status === "current" && (
              <span className="docs__version-badge">Current</span>
            )}
          </button>
        ))}
      </div>

      <div className="docs__version-intro">
        <p>{version.summary}</p>
        <span className="docs__released">Released {version.releasedAt}</span>
      </div>

      <div className="docs__layout">
        <nav className="docs__nav" aria-label="Section navigation">
          {version.sections.map(({ id, title }) => (
            <a key={id} href={`#${id}`} className="docs__nav-link">
              {title}
            </a>
          ))}
        </nav>

        <div className="docs__content">
          {version.sections.map(({ id, title, content }) => (
            <section key={id} id={id} className="docs__section">
              <h2>{title}</h2>
              <div className="docs__section-body">{content}</div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
