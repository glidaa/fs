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
  }, [])
  return (
    <div
      style={style}
      className={[
        styles.TextareaContainer,
        ...(error && [styles.error] || []),
        ...(isFocused && [styles.focused] || [])
      ].join(" ")}
    >
      {label && (
        <label htmlFor={name}>
          {label}
        </label>
      )}
      <div>
        <textarea
          name={name}
          value={value}
          ref={textareaRef}
          placeholder={placeholder}
          onChange={onChange}
          readOnly={readOnly}
          onInput={adjustSize}
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