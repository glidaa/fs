import { nanoid } from "nanoid"
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
  } = props
  const [ id ] = useState("Textarea" + nanoid(11))
  const textareaRef = useRef(null)
  const handleFieldClick = () => {
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus()
    }
  }
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
      className={[
        styles.TextareaContainer,
        ...(error && [styles.error] || []),
        ...(readOnly && [styles.readOnly] || []),
        ...(disabled && [styles.disabled] || []),
        ...(value && [styles.filled] || [])
      ].join(" ")}
    >
      {label && (
        <label htmlFor={id}>
          {label}
        </label>
      )}
      <div onClick={handleFieldClick}>
        <textarea
          id={id}
          name={name}
          value={value || ""}
          rows={1}
          ref={textareaRef}
          placeholder={label ? null : placeholder}
          onChange={onChange}
          readOnly={readOnly}
          disabled={disabled}
        ></textarea>
      </div>
      {error && <span>{error}</span>}
    </div>
  )
}

export default Textarea