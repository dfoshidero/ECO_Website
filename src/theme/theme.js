//
// Runtime theme controller. Reads/writes the user's preferred theme from
// localStorage, falls back to the device color scheme when unset, and applies
// the result by setting `document.documentElement.dataset.theme`.
// Keep resolution order aligned with the inline script in public/index.html.
// All visual tokens live as CSS custom properties in styles/tokens.scss keyed
// off that data attribute.

export const STORAGE_KEY = "eco-theme";

export const THEMES = Object.freeze({
  LIGHT: "light",
  DARK: "dark",
});

const DEFAULT_THEME = THEMES.LIGHT;

const isValidTheme = (value) =>
  value === THEMES.LIGHT || value === THEMES.DARK;

export function readStoredTheme() {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isValidTheme(stored)) return stored;
  } catch {
    // localStorage may be unavailable (private mode, SSR).
  }
  return null;
}

export function clearStoredTheme() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Best-effort; ignore access errors.
  }
}

/** Device/OS preference via `prefers-color-scheme`. */
export function getSystemTheme() {
  if (typeof window === "undefined") return DEFAULT_THEME;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? THEMES.DARK
    : THEMES.LIGHT;
}

/** Theme already applied on `<html>` (e.g. by the inline script in index.html). */
export function getCurrentTheme() {
  if (typeof document === "undefined") return DEFAULT_THEME;
  const fromDom = document.documentElement.dataset.theme;
  return isValidTheme(fromDom) ? fromDom : DEFAULT_THEME;
}

/**
 * Stored choice wins; else trust pre-paint DOM; else query the OS.
 * Matches public/index.html resolution order.
 */
export function getInitialTheme() {
  return readStoredTheme() ?? getCurrentTheme() ?? getSystemTheme();
}

export function applyTheme(theme, { persist = true } = {}) {
  const next = theme === THEMES.LIGHT ? THEMES.LIGHT : THEMES.DARK;
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = next;
  }
  if (persist) {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Best-effort persistence; ignore quota or access errors.
    }
  }
  return next;
}

export function toggleThemeValue(current) {
  return current === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
}
