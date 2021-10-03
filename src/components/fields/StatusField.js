import React from 'react';
import styledComponents from "styled-components";

const StatusField = (props) => {

	const {
    name,
		value,
		onChange,
    readOnly
	} = props;

	const onSelect = (status) => {
    if (!readOnly) {
      onChange({ target: {
        value: status,
        name: name || "status"
      }})
    }
	};

	return (
		<StatusFieldShell readOnly={readOnly}>
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
	)
}

const StatusSelection = styledComponents.button`
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

const StatusFieldShell = styledComponents.div`
	display: flex;
	flex-direction: row;
	gap: 5px;
  ${StatusSelection} {
    cursor: ${({readOnly}) => readOnly ? "default" : "pointer"};
  }
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
