import React from 'react';
import styledComponents from "styled-components";

const GenderField = (props) => {

	const {
    name,
		value,
		onChange,
    readOnly
	} = props;

	const onSelect = (gender) => {
    if (!readOnly) {
      onChange({ target: {
        value: gender,
        name: name || "gender"
      }})
    }
	};

	return (
		<GenderFieldShell readOnly={readOnly}>
			<MaleGenderSelection
        isSelected={value === "male"}
        onClick={() => onSelect("male")}
      >
        Male
      </MaleGenderSelection>
			<FemaleGenderSelection
        isSelected={value === "female"}
        onClick={() => onSelect("female")}
      >
        Female
      </FemaleGenderSelection>
		</GenderFieldShell>
	)
}

const GenderSelection = styledComponents.button`
  padding: 5px 10px;
  border: 2px solid transparent;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  outline: none;
  transition: color 0.2s, border-color 0.2s;
  ${({ isSelected }) => isSelected ? `
    color: #5D6969;
    border-color: #7DAAFC;
    cursor: default;
  ` : `
    color: #AAA8AC;
  `}
`

const GenderFieldShell = styledComponents.div`
	display: flex;
	flex-direction: row;
	gap: 5px;
  ${GenderSelection} {
    cursor: ${({readOnly}) => readOnly ? "default" : "pointer"};
  }
`

const MaleGenderSelection = styledComponents(GenderSelection)`
  background-color: #FFEBE5;
`

const FemaleGenderSelection = styledComponents(GenderSelection)`
  background-color: #FDF1DB;
`

export default GenderField
