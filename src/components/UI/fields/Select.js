import React from 'react';
import styled from "styled-components";
import { glassmorphism } from '../../../styles';

const Select = (props) => {

	const {
    name,
		value,
    values,
    options,
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
            {options[i]}
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
  padding: 5px 10px;
  border: 2px solid transparent;
  font-weight: 600;
  font-size: 14px;
  ${glassmorphism(8, 0.75)}
  transition: color 0.2s, border-color 0.2s;
  ${({ isSelected }) => isSelected ? `
    color: var(--primary);
    border-color: var(--primary);
    cursor: default;
  ` : `
    color: #000000;
  `}
`

const SelectContainer = styled.div`
	display: flex;
	flex-direction: row;
	gap: 5px;
  ${Selection} {
    cursor: ${({readOnly}) => readOnly ? "default" : "pointer"};
  }
`

export default Select
