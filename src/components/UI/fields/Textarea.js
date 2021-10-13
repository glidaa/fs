import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components"

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
    <TextareaContainer
      style={style}
      isError={error}
      isFocused={isFocused}
    >
      <label htmlFor={name}>
        {label}
      </label>
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
    </TextareaContainer>
  )
}

const TextareaContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  & > *:not(:last-child) {
    margin-bottom: 5px;
  }
  & > label {
    color: #222222;
    margin-bottom: 0;
    width: max-content;
    font-size: 14px;
    font-weight: 600;
  }
  & > div {
    position: relative;
    display: grid;
    width: 100%;
    border-radius: 8px;
    &::after {
      content: attr(data-replicated-value) " ";
      white-space: pre-wrap;
      visibility: hidden;
    }
    & > textarea {
      resize: none;
      overflow: hidden;
      &:disabled {
        background-color: #FAFAFA;
      }
      &::placeholder {
        color: #C0C0C0;
      }
    }
    & > textarea, &::after {
      width: calc(100% - 20px);
      padding: 5px 10px;
      background-color: transparent;
      border-radius: 8px;
      border: none;
      border: 1px solid ${({isError, isFocused, theme}) => 
        isError ? "#FF0000" : isFocused ? theme.primary : "#C0C0C0"};
      font-size: 14px;
      font-weight: 400;
      grid-area: 1 / 1 / 2 / 2;
    }
  }
  & > span {
    color: #FF0000;
    font-size: 12px;
  }
`

export default Textarea