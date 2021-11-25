import React, { useState } from "react"
import styles from "./Toggle.module.scss"

const Toggle = (props) => {
  const {
    value = "",
    onChange,
    error,
    label,
    name,
    readOnly,
    disabled,
    style
  } = props
  const [isFocused, setIsFocused] = useState(false)
  return (
    <div className={styles.ToggleShell} style={style}>
      <div
        className={[
          styles.ToggleContainer,
          ...(disabled && [styles.disabled] || []),
          ...(error && [styles.error] || []),
          ...(isFocused && [styles.focused] || [])
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
          onClick={() => onChange({
            target: {
              name: name,
              value: !value
            }
          })}
        >
          <div />
        </div>
      </div>
      {error && <span>{error}</span>}
    </div>
  )
}

export default Toggle