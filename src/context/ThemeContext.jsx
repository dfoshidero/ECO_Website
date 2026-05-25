import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "eco-theme";

const ThemeContext = createContext(null);

const getSystemTheme = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

const getStoredTheme = () => {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
};

const getInitialTheme = () => getStoredTheme() ?? getSystemTheme();

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getInitialTheme);
  // Tracks whether the user has explicitly chosen a theme. When false, we
  // follow the OS `prefers-color-scheme` and do not persist to localStorage.
  const userOverrodeRef = useRef(getStoredTheme() !== null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (userOverrodeRef.current) {
      localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event) => {
      if (!userOverrodeRef.current) {
        setThemeState(event.matches ? "dark" : "light");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const setTheme = (next) => {
    userOverrodeRef.current = true;
    setThemeState(next);
  };
  const toggleTheme = () => {
    userOverrodeRef.current = true;
    setThemeState((t) => (t === "light" ? "dark" : "light"));
  };

  const resetThemeToSystem = () => {
    userOverrodeRef.current = false;
    localStorage.removeItem(STORAGE_KEY);
    setThemeState(getSystemTheme());
  };

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, toggleTheme, resetThemeToSystem }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
