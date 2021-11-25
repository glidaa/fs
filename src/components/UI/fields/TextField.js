import React, { useState } from "react"
import styles from "./TextField.module.scss"

const TextField = (props) => {
  const {
    value = "",
    onChange,
    autoComplete,
    placeholder,
    type,
    error,
    label,
    name,
    prefix,
    suffix,
    readOnly,
    disabled,
    style
  } = props
  const [isFocused, setIsFocused] = useState(false)
  return (
    <div
      className={[
        styles.TextFieldShell,
        ...(disabled && [styles.disabled] || []),
        ...(error && [styles.error] || []),
        ...(isFocused && [styles.focused] || []),
        ...(value && [styles.filled] || [])
      ].join(" ")}
      style={style}
    >
      <div
        className={[
          styles.TextFieldContainer,
          ...(disabled && [styles.disabled] || []),
          ...(error && [styles.error] || []),
          ...(isFocused && [styles.focused] || []),
          ...(readOnly && [styles.readOnly] || []),
          ...((value || prefix) && [styles.filled] || [])
        ].join(" ")}
      >
        {label && (
          <label htmlFor={name}>
            {label}
          </label>
        )}
        {prefix && React.createElement(prefix)}
        <input
          type={type}
          name={name}
          autoComplete={autoComplete}
          onChange={onChange}
          value={value || ""}
          placeholder={label ? null : placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          readOnly={readOnly}
          disabled={disabled}
        />
        {suffix && React.createElement(suffix)}
      </div>
      {error && <span>{error}</span>}
    </div>
  )
}

export default TextField