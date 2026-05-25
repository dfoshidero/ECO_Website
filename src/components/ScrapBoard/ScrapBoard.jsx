import React from "react";

const ScrapBoard = ({ items, activeId, onSelect }) => (
  <div className="insight__session-grid">
    {items.map((item) => (
      <button
        key={item.id}
        type="button"
        className={`insight__session-card ${
          activeId === item.id ? "is-active" : ""
        }`}
        onClick={() => onSelect(item)}
      >
        <span className="insight__session-value">
          {item.prediction} kgCO₂e/m²
        </span>
        <span className="insight__session-snippet">{item.snippet}</span>
        <time className="insight__session-time">
          {new Date(item.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </button>
    ))}
  </div>
);

export default ScrapBoard;
