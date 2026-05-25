export const RIBA_BENCHMARKS = {
  office: {
    key: "office",
    label: "Non-Domestic Office",
    bau: 1400,
    target2025: 970,
    target2030: 750,
  },
  residential: {
    key: "residential",
    label: "Domestic / Residential",
    bau: 1200,
    target2025: 800,
    target2030: 625,
  },
  schools: {
    key: "schools",
    label: "Schools",
    bau: 1000,
    target2025: 675,
    target2030: 540,
  },
};

const SCHOOL_HINTS = ["school", "library", "education", "primary", "secondary"];

export const resolveBenchmark = (extracted = {}, description = "") => {
  const sector = String(extracted?.Sector || "").toLowerCase();
  const subSector = String(extracted?.["Sub-Sector"] || "").toLowerCase();
  const combined = `${subSector} ${description}`.toLowerCase();

  if (sector === "residential") {
    return RIBA_BENCHMARKS.residential;
  }

  if (SCHOOL_HINTS.some((hint) => combined.includes(hint))) {
    return RIBA_BENCHMARKS.schools;
  }

  return RIBA_BENCHMARKS.office;
};

export const getBenchmarkRating = (value, benchmark = RIBA_BENCHMARKS.office) => {
  const score = parseFloat(value);
  if (Number.isNaN(score)) {
    return { band: "unknown", label: "Unknown" };
  }

  if (score <= benchmark.target2030) {
    return { band: "good", label: "Meets RIBA 2030" };
  }
  if (score <= benchmark.target2025) {
    return { band: "fair", label: "Meets RIBA 2025" };
  }
  if (score <= benchmark.bau) {
    return { band: "warning", label: "Above target" };
  }
  return { band: "high", label: "High" };
};

export const getScalePosition = (value, benchmark = RIBA_BENCHMARKS.office) => {
  const score = parseFloat(value);
  const max = benchmark.bau * 1.5;
  if (Number.isNaN(score) || max <= 0) return 0;
  return Math.min(Math.max((score / max) * 100, 0), 100);
};

export const getThresholdPosition = (threshold, benchmark = RIBA_BENCHMARKS.office) => {
  const max = benchmark.bau * 1.5;
  if (max <= 0) return 0;
  return Math.min(Math.max((threshold / max) * 100, 0), 100);
};
