import React, {
  useRef,
  useState,
  useMemo,
  useCallback,
  useLayoutEffect,
} from "react";
import "./BriefEditor.scss";

const MIN_LINES = 5;

const normalizePlaceholder = (placeholder) => {
  if (Array.isArray(placeholder)) {
    return placeholder.filter(Boolean);
  }
  return placeholder ? [placeholder] : [];
};

const sanitize = (text) => text.replace(/[\r\n]+/g, " ");

const BriefEditor = ({
  value,
  onChange,
  onFocus,
  onBlur,
  onSubmit,
  placeholder = "",
  ariaLabel = "Building description",
}) => {
  const textareaRef = useRef(null);
  const [rowCount, setRowCount] = useState(MIN_LINES);

  const placeholderLines = useMemo(
    () => normalizePlaceholder(placeholder),
    [placeholder]
  );

  const updateRows = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const cs = window.getComputedStyle(ta);
    const lh = parseFloat(cs.lineHeight);
    const padT = parseFloat(cs.paddingTop);
    const padB = parseFloat(cs.paddingBottom);
    const contentH = Math.max(ta.scrollHeight - padT - padB, 0);
    const rows = Math.max(MIN_LINES, Math.round(contentH / lh) || 1);
    ta.style.height = `${padT + padB + rows * lh}px`;
    setRowCount(rows);
  }, []);

  useLayoutEffect(() => {
    updateRows();
  }, [value, updateRows]);

  useLayoutEffect(() => {
    const ta = textareaRef.current;
    if (!ta || typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(() => updateRows());
    ro.observe(ta);
    return () => ro.disconnect();
  }, [updateRows]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        onSubmit?.();
        return;
      }
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    onChange(sanitize(e.target.value));
  };

  const isEmpty = value === "";

  return (
    <div className="brief-editor">
      <div className="brief-editor__rows" aria-hidden="true">
        {Array.from({ length: rowCount }, (_, i) => {
          const placeholderIndex = i % 2 === 0 ? i / 2 : -1;
          const showPlaceholder =
            isEmpty &&
            placeholderIndex >= 0 &&
            placeholderIndex < placeholderLines.length;
          return (
            <div key={i} className="brief-editor__row">
              <span className="brief-editor__num">{i + 1}</span>
              {showPlaceholder && (
                <span className="brief-editor__placeholder">
                  {placeholderLines[placeholderIndex]}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <textarea
        ref={textareaRef}
        className="brief-editor__textarea"
        value={value}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        spellCheck
        aria-label={ariaLabel}
        rows={1}
      />
    </div>
  );
};

export default BriefEditor;
