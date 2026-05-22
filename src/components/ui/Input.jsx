import React from "react";
import "./Input.scss";

const Input = ({ label, id, className = "", ...props }) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className={`ui-field ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="ui-field__label">
          {label}
        </label>
      )}
      <input id={inputId} className="ui-field__input" {...props} />
    </div>
  );
};

export default Input;
