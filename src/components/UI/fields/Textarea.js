import React, { useEffect, useRef, useState } from "react"
import styles from "./Textarea.module.scss"

const Textarea = (props) => {
  const {
    name,
    value = "",
    onChange,
    placeholder,
    readOnly,
    error,
    label,
    disabled,
    style
  } = props
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef(null)
  const adjustSize = ({ target }) => {
    target.parentNode.dataset.replicatedValue = target.value
  }
  useEffect(() => {
    if (textareaRef.current) {
      adjustSize({ target: textareaRef.current })
    }
  }, [value])
  return (
    <div
      style={style}
      className={[
        styles.TextareaContainer,
        ...(error && [styles.error] || []),
        ...(isFocused && [styles.focused] || []),
        ...(readOnly && [styles.readOnly] || []),
        ...(value && [styles.filled] || [])
      ].join(" ")}
    >
      <div>
        {label && (
          <label htmlFor={name}>
            {label}
          </label>
        )}
        <textarea
          name={name}
          value={value || ""}
          rows={1}
          ref={textareaRef}
          placeholder={label ? null : placeholder}
          onChange={onChange}
          readOnly={readOnly}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
        ></textarea>
      </div>
      {error && <span>{error}</span>}
    </div>
  )
}

export default Textarea