import React, { useMemo } from "react";
import {
  resolveBenchmark,
  getBenchmarkRating,
  getScalePosition,
  getThresholdPosition,
} from "../../data/ribaBenchmarks";
import "./RibaScale.scss";

const BAND_COLORS = {
  good: "var(--accent)",
  fair: "#a3c45a",
  warning: "var(--warning)",
  high: "var(--terracotta)",
};

const RibaScale = ({ value, extracted = {}, description = "" }) => {
  const benchmark = useMemo(
    () => resolveBenchmark(extracted, description),
    [extracted, description]
  );
  const rating = useMemo(
    () => getBenchmarkRating(value, benchmark),
    [value, benchmark]
  );
  const markerPosition = useMemo(
    () => getScalePosition(value, benchmark),
    [value, benchmark]
  );

  const thresholds = [
    { key: "target2030", label: "2030", value: benchmark.target2030 },
    { key: "target2025", label: "2025", value: benchmark.target2025 },
    { key: "bau", label: "BAU", value: benchmark.bau },
  ];

  const gradientStops = useMemo(() => {
    const p2030 = getThresholdPosition(benchmark.target2030, benchmark);
    const p2025 = getThresholdPosition(benchmark.target2025, benchmark);
    const pBau = getThresholdPosition(benchmark.bau, benchmark);

    return `linear-gradient(to right,
      ${BAND_COLORS.good} 0%,
      ${BAND_COLORS.good} ${p2030}%,
      ${BAND_COLORS.fair} ${p2030}%,
      ${BAND_COLORS.fair} ${p2025}%,
      ${BAND_COLORS.warning} ${p2025}%,
      ${BAND_COLORS.warning} ${pBau}%,
      ${BAND_COLORS.high} ${pBau}%,
      ${BAND_COLORS.high} 100%)`;
  }, [benchmark]);

  return (
    <div className="riba-scale" role="img" aria-label={`RIBA benchmark: ${rating.label}`}>
      <p className="riba-scale__caption">
        RIBA 2030 Climate Challenge — {benchmark.label}
      </p>

      <div className="riba-scale__track-wrap">
        <div
          className="riba-scale__marker"
          style={{ left: `${markerPosition}%` }}
          aria-hidden="true"
        >
          <span className="riba-scale__marker-value">{value}</span>
          <span className="riba-scale__marker-caret">▼</span>
          <span className="riba-scale__marker-line" />
        </div>

        <div
          className="riba-scale__track"
          style={{ background: gradientStops }}
        />

        <div className="riba-scale__ticks">
          {thresholds.map(({ key, label, value: thresholdValue }) => (
            <div
              key={key}
              className="riba-scale__tick"
              style={{ left: `${getThresholdPosition(thresholdValue, benchmark)}%` }}
            >
              <span className="riba-scale__tick-line" />
              <span className="riba-scale__tick-label">{label}</span>
              <span className="riba-scale__tick-value">{thresholdValue}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="riba-scale__legend">
        <span className="riba-scale__legend-item riba-scale__legend-item--good">
          Meets RIBA 2030
        </span>
        <span className="riba-scale__legend-item riba-scale__legend-item--fair">
          Meets RIBA 2025
        </span>
        <span className="riba-scale__legend-item riba-scale__legend-item--warning">
          Above target
        </span>
        <span className="riba-scale__legend-item riba-scale__legend-item--high">
          High
        </span>
      </div>

      <p className={`riba-scale__rating riba-scale__rating--${rating.band}`}>
        {rating.label}
      </p>
    </div>
  );
};

export default RibaScale;
