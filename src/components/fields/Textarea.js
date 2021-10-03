import React, { useEffect, useRef } from "react"
import styledComponents from "styled-components"

const Textarea = (props) => {
  const {
    name,
    value,
    onChange,
    placeholder,
    width,
    readOnly
  } = props
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
    <TextareaContainer width={width}>
      <textarea
        name={name}
        value={value}
        ref={textareaRef}
        placeholder={placeholder}
        onChange={onChange}
        readOnly={readOnly}
        onInput={adjustSize}
      ></textarea>
    </TextareaContainer>
  )
}

const TextareaContainer = styledComponents.div`
  display: grid;
  width: 100%;
  &::after {
    content: attr(data-replicated-value) " ";
    white-space: pre-wrap;
    visibility: hidden;
  }
  & > textarea {
    resize: none;
    overflow: hidden;
    &::placeholder {
      color: #C0C0C0;
    }
  }
  & > textarea, &::after {
    ${({width}) => width ? `width: ${width};` : ''}
    padding: 5px 10px;
    border: 1px solid #C0C0C0;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 400;
    grid-area: 1 / 1 / 2 / 2;
  }
`

export default Textarea