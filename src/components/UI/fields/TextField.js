import React, { useState } from "react"
import styled from "styled-components"

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
    <TextFieldShell style={style}>
      {label && (
        <label htmlFor={name}>
          {label}
        </label>
      )}
      <TextFieldContainer
        disabled={disabled}
        isError={error}
        isFocused={isFocused}
      >
        {prefix && React.createElement(prefix)}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={onChange}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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
  & > *:not(:last-child) {
    margin-bottom: 5px;
  }
  & > label {
    color: ${({theme})=> theme.txtColor};
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
  position: relative;
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
  & > span {
    color: #C0C0C0;
  }
  border: 1px solid ${({isError, isFocused, theme}) => 
    isError ? "#FF0000" : isFocused ? theme.primary : "#C0C0C0"};
  background-color: ${({disabled, theme}) => disabled ? "#FAFAFA" : theme.secondaryBg};
  & > input {
    border: none;
    outline: none;
    padding: 0;
    width: 100%;
    color: ${({theme})=> theme.txtColor};
    background-color: ${({theme})=> theme.secondaryBg};
    &:disabled {
      background-color: #FAFAFA;
    }
    &::placeholder {
      color: #C0C0C0;
    }
  }
  & *:not(input) {
    color: #C0C0C0!important;
  }
`

export default TextField