import React from 'react';
import styled from "styled-components";

const CardSelect = (props) => {

	const {
    name,
		value,
    values,
    options,
    descriptions,
		onChange,
    label,
    readOnly,
    style
	} = props;

	const onSelect = (nextVal) => {
    if (!readOnly) {
      onChange({ target: {
        value: nextVal,
        name: name
      }})
    }
	};

	return (
    <SelectShell style={style}>
      <label htmlFor={name}>
        {label}
      </label>
      <SelectContainer readOnly={readOnly}>
        {values.map((x, i) => (
          <Selection
            key={x}
            isSelected={value === x}
            onClick={() => onSelect(x)}
          >
            <span>{options[i]}</span>
            <span>{descriptions[i]}</span>
          </Selection>
        ))}
      </SelectContainer>
    </SelectShell>
	)
}

const SelectShell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  & > label {
    color: ${({theme})=> theme.txtColor};
    margin-bottom: 0;
    width: max-content;
    font-size: 14px;
    font-weight: 600;
  }
  & > *:not(:last-child) {
    margin-bottom: 5px;
  }
`

const Selection = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  text-align: left;
  padding: 12px;
  border: 2px solid transparent;
  outline: none;
  cursor: pointer;
  border-radius: 8px;
  transition: color 0.2s, border-color 0.2s;
  & > span:nth-child(1) {
    font-size: 24px;
    font-weight: 600;
  }
  & > span:nth-child(2) {
    font-size: 14px;
    font-weight: 400;
  }
  ${({ isSelected }) => isSelected ? `
    border-color: ${({theme})=> theme.primary};
    & > span:nth-child(1) {
      color: ${({theme})=> theme.primary};
    }
    & > span:nth-child(2) {
      color: #5D6969;
    }
  ` : `
    & > span:nth-child(1) {
      color: ${({theme})=> theme.primaryDark};
    }
    & > span:nth-child(2) {
      color: #AAA8AC;
    }
  `}
`

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  opacity: ${({disabled}) => disabled ? "0.6" : "1"};
  transition: opacity 0.3s;
  & > *:not(:last-child) {
    margin-bottom: 5px;
  }
`

export default CardSelect
