import React from 'react';
import styledComponents from "styled-components";

const StatusField = (props) => {

	const {
		value,
		onChange,
    readOnly
	} = props;

	const onSelect = (status) => {
    if (!readOnly) {
      onChange({ target: {
        value: status,
        name: "status"
      }})
    }
	};

	return (
		<StatusFieldShell>
			<TodoStatusSelection
        isSelected={value === "todo"}
        onClick={() => onSelect("todo")}
      >
        Todo
      </TodoStatusSelection>
			<StartedStatusSelection
        isSelected={value === "pending"}
        onClick={() => onSelect("pending")}
      >
        Started
      </StartedStatusSelection>
			<FinishedStatusSelection
        isSelected={value === "done"}
        onClick={() => onSelect("done")}
      >
        Finished
      </FinishedStatusSelection>
		</StatusFieldShell>
	);
};

const StatusFieldShell = styledComponents.div`
	display: flex;
	flex-direction: row;
	gap: 5px;
`

const StatusSelection = styledComponents.button`
    padding: 5px 10px;
    border: 2px solid transparent;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    outline: none;
    cursor: pointer;
		transition: color 0.2s, border-color 0.2s;
    ${({ isSelected }) => isSelected ? `
      color: #5D6969;
      border-color: #7DAAFC;
    ` : `
      color: #AAA8AC;
    `}
    
`

const TodoStatusSelection = styledComponents(StatusSelection)`
    background-color: #FFEBE5;
`

const StartedStatusSelection = styledComponents(StatusSelection)`
    background-color: #FDF1DB;
`

const FinishedStatusSelection = styledComponents(StatusSelection)`
    background-color: #DAF6F4;
`

export default StatusField
