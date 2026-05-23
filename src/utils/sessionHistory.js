import options from "../data/options.json";

const STORAGE_KEY = "eco-insight-session";

export const loadSession = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveSession = (items) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota exceeded — ignore */
  }
};

export const createSessionItem = ({
  description,
  prediction,
  extractedData,
  coverage,
}) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  timestamp: Date.now(),
  snippet:
    description.length > 80
      ? `${description.slice(0, 80)}…`
      : description,
  description,
  prediction,
  extractedData,
  coverage,
  lowConfidence: coverage?.level === "low",
});

export const getGreeting = () => {
  const hours = new Date().getHours();
  if (hours < 12) return "Good morning";
  if (hours < 18) return "Good afternoon";
  return "Good evening";
};

export const countValidFields = (extracted) =>
  Object.values(extracted || {}).filter(
    (field) => field !== null && field !== "None" && field !== ""
  ).length;

export const getTotalFields = (opts = options) => {
  let n = 0;
  for (const cat of Object.values(opts.materials)) {
    n += Object.keys(cat).length;
  }
  n += 2; // sector + sub-sector
  n += opts.numericalOptions.length;
  return n;
};

export const getCoverage = (extracted) => {
  const valid = countValidFields(extracted);
  const total = getTotalFields();
  const ratio = total ? valid / total : 0;
  const level = valid < 5 ? "low" : ratio < 0.7 ? "partial" : "good";
  return { valid, total, ratio, level };
};

export const formatCoveragePercent = (ratio) => Math.round(ratio * 100);

export const getFeatureChips = (extracted, limit = 4) => {
  if (!extracted) return [];
  return Object.entries(extracted)
    .filter(([, v]) => v !== null && v !== "None" && v !== "")
    .slice(0, limit)
    .map(([key, value]) => ({
      key: key.replace(/ Material$/, ""),
      value: String(value),
    }));
};
