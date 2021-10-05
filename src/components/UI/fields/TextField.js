import React from "react"
import styledComponents from "styled-components"

const TextField = (props) => {
  const {
    value,
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

const TextFieldShell = styledComponents.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 5px;
  & > label {
    color: #222222;
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

const TextFieldContainer = styledComponents.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: calc(100% - 20px);
  padding: 5px 10px;
  border: 1px solid #C0C0C0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 400;
  & > span {
    color: #C0C0C0;
  }
  border: 1px solid ${({isError}) => isError ? "#FF0000" : "#C0C0C0"};
  background-color: ${({ disabled }) => disabled ? "#FAFAFA" : "transparent"};
  & > input {
    border: none;
    outline: none;
    padding: 0;
    width: 100%;
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