import React from "react";
import "./Card.scss";

const Card = ({ children, className = "", padding = "md", ...props }) => (
  <div
    className={`ui-card ui-card--${padding} ${className}`.trim()}
    {...props}
  >
    {children}
  </div>
);

export default Card;
