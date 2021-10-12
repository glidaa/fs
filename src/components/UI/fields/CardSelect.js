import React from 'react';
import styled from "styled-components";
import { glassmorphism } from '../../../styles';

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
  gap: 5px;
  & > label {
    color: #000000;
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
  outline: none;
  cursor: pointer;
  ${glassmorphism(8)}
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
    border-color: var(--primary);
    & > span:nth-child(1) {
      color: var(--primary);
    }
    & > span:nth-child(2) {
      color: #5D6969;
    }
  ` : `
    & > span:nth-child(1) {
      color: var(--primary-dark);
    }
    & > span:nth-child(2) {
      color: #AAA8AC;
    }
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
