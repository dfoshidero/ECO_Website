import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import "./Tooltip.scss";

const Tooltip = ({ content, children, disabled = false }) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const wrapRef = useRef(null);

  if (!content || !disabled) {
    return children;
  }

  const show = (e) => {
    const rect = (wrapRef.current || e.currentTarget).getBoundingClientRect();
    setCoords({
      top: rect.top - 8,
      left: rect.left + rect.width / 2,
    });
    setVisible(true);
  };

  const hide = () => setVisible(false);

  return (
    <>
      <span
        ref={wrapRef}
        className="ui-tooltip-wrap"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </span>
      {visible &&
        createPortal(
          <div
            className="ui-tooltip"
            style={{
              top: coords.top,
              left: coords.left,
              transform: "translate(-50%, -100%)",
            }}
            role="tooltip"
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
};

export default Tooltip;
