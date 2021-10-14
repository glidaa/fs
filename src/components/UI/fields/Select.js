import React from 'react';
import styled from "styled-components";

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
      {label && (
        <label htmlFor={name}>
          {label}
        </label>
      )}
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
  padding: 5px 10px;
  border: 2px solid transparent;
  font-weight: 600;
  font-size: 14px;
  border-radius: 8px;
  background-color: ${({color}) => color};
  transition: color 0.2s, border-color 0.2s;
  ${({ isSelected }) => isSelected ? `
    color: #5D6969;
    border-color: #7DAAFC;
    cursor: default;
  ` : `
    color: #AAA8AC;
  `}
`

const SelectContainer = styled.div`
	display: flex;
	flex-direction: row;
  ${Selection} {
    cursor: ${({readOnly}) => readOnly ? "default" : "pointer"};
  }
  & > *:not(:last-child) {
    margin-right: 5px;
  }
`

export default Select
