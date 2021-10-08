import React from "react"
import styled from "styled-components"
import { glassmorphism } from "../../../styles"

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
  return (
    <TextFieldShell style={style}>
      <label htmlFor={name}>
        {label}
      </label>
      <TextFieldContainer disabled={disabled}>
        {prefix && React.createElement(prefix)}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={onChange}
          value={value}
          readOnly={readOnly}
          disabled={disabled}
        />
        {suffix && React.createElement(suffix)}
      </TextFieldContainer>
      {error && <span>{error}</span>}
    </TextFieldShell>
  )
}

const TextFieldShell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 5px;
  & > label {
    color: #000000;
    margin-bottom: 0;
    width: max-content;
    font-size: 14px;
    font-weight: 600;
  }
  & > span {
    color: #FF0000;
    font-size: 12px;
  }
`

const TextFieldContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: calc(100% - 20px);
  padding: 5px 10px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 400;
  ${glassmorphism(8)}
  & > span {
    color: #939393;
  }
  /* background-color: ${({ disabled }) => disabled ? "#FAFAFA" : "transparent"}; */
  & > input {
    border: none;
    outline: none;
    padding: 0;
    width: 100%;
    background-color: transparent;
    &:disabled {
      background-color: #FAFAFA;
    }
    &::placeholder {
      color: #939393;
    }
  }
  & *:not(input) {
    color: #939393!important;
  }
`

export default TextField