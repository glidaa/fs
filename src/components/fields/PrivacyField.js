import React from 'react';
import styledComponents from "styled-components";

const PrivacyField = (props) => {

	const {
    name,
		value,
		onChange,
    readOnly,
    disabled
	} = props;

	const onSelect = (privacy) => {
    if (!readOnly) {
      onChange({ target: {
        value: privacy,
        name: name || "privacy"
      }})
    }
	};

	return (
		<PrivacyFieldShell disabled={disabled}>
			<PublicPrivacySelection
        isSelected={value === "public"}
        onClick={() => onSelect("public")}
      >
        <span>Public</span>
        <span>Make this project accessible to others via its unique permalink.</span>
      </PublicPrivacySelection>
			<PrivatePrivacySelection
        isSelected={value === "private"}
        onClick={() => onSelect("private")}
      >
        <span>Private</span>
        <span>Make this project not visible to anyone other than you.</span>
      </PrivatePrivacySelection>
		</PrivacyFieldShell>
	);
};

const PrivacyFieldShell = styledComponents.div`
	display: flex;
	flex-direction: column;
	gap: 5px;
  width: 100%;
  opacity: ${({disabled}) => disabled ? "0.6" : "1"};
  transition: opacity 0.3s;
`

const PrivacySelection = styledComponents.button`
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

const PublicPrivacySelection = styledComponents(PrivacySelection)`
  background-color: #FFEBE5;
`

const PrivatePrivacySelection = styledComponents(PrivacySelection)`
  background-color: #FDF1DB;
`

export default PrivacyField
