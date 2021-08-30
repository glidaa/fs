import React from 'react';
import styledComponents from "styled-components";

const PermissionsField = (props) => {

	const {
		value,
		onChange,
    readOnly,
    disabled
	} = props;

	const onSelect = (permission) => {
    if (!readOnly) {
      onChange({ target: {
        value: permission,
        name: "permissions"
      }})
    }
	};

	return (
		<PermissionsFieldShell disabled={disabled}>
			<ReadWritePermissionSelection
        isSelected={value === "rw"}
        onClick={() => onSelect("rw")}
      >
        <span>Read Write</span>
        <span>Make this project writable by other users who have the permission to access its tasks.</span>
      </ReadWritePermissionSelection>
			<ReadOnlyPermissionSelection
        isSelected={value === "r"}
        onClick={() => onSelect("r")}
      >
        <span>Read Only</span>
        <span>Prevent other users who have the permission to access this project from modifying its contents.</span>
      </ReadOnlyPermissionSelection>
		</PermissionsFieldShell>
	);
};

const PermissionsFieldShell = styledComponents.div`
	display: flex;
	flex-direction: column;
	gap: 5px;
  width: 100%;
  opacity: ${({disabled}) => disabled ? "0.6" : "1"};
  transition: opacity 0.3s linear;
`

const PermissionSelection = styledComponents.button`
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

const ReadWritePermissionSelection = styledComponents(PermissionSelection)`
  background-color: #FFEBE5;
`

const ReadOnlyPermissionSelection = styledComponents(PermissionSelection)`
  background-color: #FDF1DB;
`

export default PermissionsField
