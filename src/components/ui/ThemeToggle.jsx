import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { HiSun, HiMoon } from "react-icons/hi2";
import "./ThemeToggle.scss";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <span className="theme-toggle__icon theme-toggle__icon--light">
        <HiSun />
      </span>
      <span className="theme-toggle__icon theme-toggle__icon--dark">
        <HiMoon />
      </span>
      <span className="theme-toggle__label">
        {theme === "light" ? "Dark mode" : "Light mode"}
      </span>
    </button>
  );
};

export default ThemeToggle;
