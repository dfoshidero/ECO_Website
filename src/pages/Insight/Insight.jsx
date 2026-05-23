import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaSyncAlt } from "react-icons/fa";
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
import EcoAnimatedText from "../../components/AnimatedText/EcoAnimatedText";
import { Button, Card } from "../../components/ui";
import {
  insightExampleInputs,
  insightPlaceholders,
} from "../../data/examples";
import { useTheme } from "../../context/ThemeContext";
import "./InsightPage.scss";

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
  const logoSrc = `${process.env.PUBLIC_URL}/assets/images/${
    theme === "dark" ? "logo-white.png" : "logo-dark.png"
  }`;

  const [description, setDescription] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [extractedData, setExtractedData] = useState({});
  const [coverage, setCoverage] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [randomExamples, setRandomExamples] = useState(
    () => getRandomExamples(insightExampleInputs, 3)
  );
  const [session, setSession] = useState(loadSession);
  const [activeId, setActiveId] = useState(null);

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

    setPrediction(null);
    setError("");
    setCoverage(null);
    setIsLoading(true);

    try {
      const extracted = await extract(trimmed);
      setExtractedData(extracted);
      const result = await predict(extracted);
      const value = parseFloat(result[0]).toFixed(2);
      setPrediction(value);

      const coverageResult = getCoverage(extracted);
      setCoverage(coverageResult);

      const item = createSessionItem({
        description: trimmed,
        prediction: value,
        extractedData: extracted,
        coverage: coverageResult,
      });
      setSession((prev) => [item, ...prev].slice(0, 20));
      setActiveId(item.id);
    } catch (err) {
      console.error("Prediction error:", err);
      setError(
        "Could not reach the prediction API. Check your connection and try again."
      );
    } finally {
      setIsLoading(false);
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

  const handleExampleClick = (input) => {
    setDescription(input);
    runPrediction(input);
  };

  const shuffleRandomExamples = () => {
    setRandomExamples((current) => {
      let next = getRandomExamples(insightExampleInputs, 3);
      if (
        next.length === current.length &&
        next.every((s, i) => s === current[i])
      ) {
        next = getRandomExamples(insightExampleInputs, 3);
      }
      return next;
    });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setRandomExamples(getRandomExamples(insightExampleInputs, 3));
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
  const showPlaceholder = !isFocused && description === "";

  return (
    <div className="insight">
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
          <p className="insight__hint">Not a chatbot; each entry is an independent
            prediction.</p>
        </div>
      </header>

      <div className="insight__workspace">
        <div className="insight__main">
          <Card padding="md" className="insight__input-card">
            <div className="insight__textarea-wrap">
              {showPlaceholder && (
                <EcoAnimatedText examples={insightPlaceholders} />
              )}
              <textarea
                className="insight__textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onFocus={handleFocus}
                onBlur={() => setIsFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handlePredict();
                  }
                }}
                rows={5}
                aria-label="Building description"
              />
            </div>

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
                <div className="insight__examples-list">
                  {randomExamples.map((input) => (
                    <button
                      key={input}
                      type="button"
                      className="insight__example-chip"
                      onClick={() => handleExampleClick(input)}
                    >
                      {input}
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
              How ECO works →
            </Link>
          </div>
          {session.length === 0 ? (
            <p className="insight__rail-empty">
              Predictions from this session appear here.
            </p>
          ) : (
            <ul className="insight__rail-list">
              {session.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`insight__rail-item ${
                      activeId === item.id ? "active" : ""
                    }`}
                    onClick={() => handleSessionSelect(item)}
                  >
                    <span className="insight__rail-value">
                      {item.prediction} kgCO₂e/m²
                    </span>
                    <span className="insight__rail-snippet">{item.snippet}</span>
                    <time className="insight__rail-time">
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Insight;
