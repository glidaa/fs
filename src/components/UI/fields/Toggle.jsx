import React, { memo } from "react"
import styles from "./Toggle.module.scss"

const Toggle = (props) => {
  const {
    value = false,
    onChange,
    error,
    label,
    name,
    readOnly,
    disabled,
    className,
    style
  } = props

  const handleToggle = (nextVal) => {
    if (!(readOnly || disabled)) {
      onChange({
        target: {
          value: nextVal,
          name: name,
        },
      });
    }
  };

  return (
    <div
      className={[
        styles.ToggleShell,
        ...(disabled && [styles.disabled] || []),
        className || ""
      ].join(" ")}
      style={style}
    >
      <div
        className={[
          styles.ToggleContainer,
          ...(error && [styles.error] || []),
          ...(readOnly && [styles.readOnly] || [])
        ].join(" ")}
      >
        {label && (
          <label htmlFor={name}>
            {label}
          </label>
        )}
        <div
          className={[
            styles.ToggleHandle,
            ...[value && styles.selected || []]
          ].join(" ")}
          onClick={() => handleToggle(!value)}
        >
          <div />
        </div>
      </div>
      {error && <span>{error}</span>}
    </div>
  )
}

export default memo(Toggle)