import React, { useState } from "react"
import styles from "./ColorPicker.module.scss"

const ColorPicker = (props) => {
  const {
    value = "",
    onChange,
    colors,
    options,
    error,
    label,
    name,
    readOnly,
    disabled,
    style
  } = props
  const [isFocused, setIsFocused] = useState(false)
  return (
    <div className={styles.ColorPickerShell} style={style}>
      {label && (
        <label htmlFor={name}>
          {label}
        </label>
      )}
      <div
        className={[
          styles.ColorPickerContainer,
          ...(disabled && [styles.disabled] || []),
          ...(error && [styles.error] || []),
          ...(isFocused && [styles.focused] || [])
        ].join(" ")}
      >
        {colors.map((color, index) => (
          <div
            key={index}
            className={styles.ColorPickerOption}
            style={{ backgroundColor: color }}
            onClick={() => onChange({
              target: {
                name: name,
                value: options[index]
              }
            })}
          />
        ))}
      </div>
      {error && <span>{error}</span>}
    </div>
  )
}

export default ColorPicker