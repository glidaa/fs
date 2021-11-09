import React, { useState, useRef } from 'react';
import { useOuterClick } from 'react-outer-click';
import styles from "./TagField.module.scss"

const TagField = (props) => {
  const {
    name,
    value = [],
    onChange,
    readOnly,
    label,
    placeholder,
    style
  } = props
  const tagFieldRef = useRef(null)
  const tagFieldInputRef = useRef(null)
  const [isEntering, setIsEntering] = useState(false)

  const handleTagClick = (e) => {
    const tag = e.target.innerText;
  }

  const handleTagSubmit = (e) => {
    e.preventDefault();
    const inputElem = e.target.querySelector('input');
    if (e.code === "Enter" && inputElem.value.trim()) {
      const tagsSet = new Set(value || [])
      tagsSet.add(inputElem.value.trim())
      inputElem.value = ""
      onChange({ target: {
        value: Array.from(tagsSet),
        name: name
      }})
    }
  }

  useOuterClick(tagFieldRef, () => {
    if (isEntering && !tagFieldInputRef.current.value.trim()) {
      setIsEntering(false);
    }
  })

  return (
    <div className={styles.TagFieldShell} style={style}>
      {label && (
        <label htmlFor={name}>
          {label}
        </label>
      )}
      <div
        className={styles.TagFieldContainer}
        ref={tagFieldRef}
      >
        {!readOnly && (
          <button
            className={styles.NewTagBtn}
            onClick={() => setIsEntering(true)}
          >+</button>
        )}
        {(value.length || isEntering) ? value.map(x => (
          <span className={styles.TagItem} key={x}>
            <span onClick={handleTagClick}>{x}</span>
            <span onClick={() => {
              const tagsSet = new Set(value || [])
              tagsSet.delete(x)
              onChange({ target: {
                value: Array.from(tagsSet),
                name: name
              }})
            }}>
              ×
            </span>
          </span>
        )) : (
          <span className={styles.NoTags}>
            No tags added 😢
          </span>
        )}
        {(!readOnly && isEntering) && (
          <form
            action="."
            className={styles.TagInput}
            onSubmit={handleTagSubmit}
          >
            <input
              ref={tagFieldInputRef}
              placeholder={placeholder}
              enterKeyHint="done"
              autoFocus
            />
          </form>
        )}
      </div>
    </div>
  )
}

export default TagField