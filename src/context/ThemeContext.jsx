import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  applyTheme,
  clearStoredTheme,
  getInitialTheme,
  getSystemTheme,
  readStoredTheme,
  THEMES,
  toggleThemeValue,
} from "../theme/theme";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getInitialTheme);
  // When false, follow OS `prefers-color-scheme` and do not persist to localStorage.
  const userOverrodeRef = useRef(readStoredTheme() !== null);

  useEffect(() => {
    applyTheme(theme, { persist: userOverrodeRef.current });
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event) => {
      if (!userOverrodeRef.current) {
        setThemeState(event.matches ? THEMES.DARK : THEMES.LIGHT);
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
    setThemeState((t) => toggleThemeValue(t));
  };

  const resetThemeToSystem = () => {
    userOverrodeRef.current = false;
    clearStoredTheme();
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
