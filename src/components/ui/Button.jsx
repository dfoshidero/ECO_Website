import React from "react";
import "./Button.scss";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
  ...props
}) => (
  <button
    type={type}
    className={`ui-btn ui-btn--${variant} ui-btn--${size} ${className}`.trim()}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

export default Button;
