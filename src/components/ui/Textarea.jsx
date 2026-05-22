import React from "react";
import "./Input.scss";

const Textarea = ({ label, id, className = "", rows = 4, ...props }) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className={`ui-field ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="ui-field__label">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className="ui-field__input ui-field__textarea"
        rows={rows}
        {...props}
      />
    </div>
  );
};

export default Textarea;
