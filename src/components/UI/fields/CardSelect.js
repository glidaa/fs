import React from 'react';
import styled from "styled-components";

const CardSelect = (props) => {

	const {
    name,
		value,
    values,
    options,
    descriptions,
    colors,
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
            color={colors[i]}
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
  gap: 5px;
  & > label {
    color: #222222;
    margin-bottom: 0;
    width: max-content;
    font-size: 14px;
    font-weight: 600;
  }
`

const Selection = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  text-align: left;
  padding: 12px;
  border: 2px solid transparent;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
  background-color: ${({color}) => color};
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
    color: #5D6969;
    border-color: #7DAAFC;
  ` : `
    color: #AAA8AC;
  `}
`

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  opacity: ${({disabled}) => disabled ? "0.6" : "1"};
  transition: opacity 0.3s;
`

export default CardSelect
