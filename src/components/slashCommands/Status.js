import React, { useState, useEffect, useMemo } from 'react';
import styledComponents from "styled-components"
import * as tasksActions from "../../actions/tasks"
import * as appActions from "../../actions/app"
import { connect } from "react-redux";

const Status = (props) => {
  const {
    commandParam,
    app: {
      selectedTask
    },
    dispatch
  } = props

  const supportedStatus = [["Todo", "#FF1744"], ["Started", "#FF9100"], ["Finished", "#00E676"]]

  const getSuggestedStatus = (commandParam) => {
    return supportedStatus.filter(x => new RegExp(`^${commandParam || ".*"}`, "i").test(x[0]))
  }

  const suggestedStatus = useMemo(() => getSuggestedStatus(commandParam), [commandParam])

  const [selection, setSelection] = useState(0)

  const chooseStatus = (selectedStatus) => {
    switch(selectedStatus) {
      case "TODO":
        dispatch(appActions.setCommand(""))
        return dispatch(tasksActions.handleUpdateTask({
          id: selectedTask,
          status: "todo"
        }))
      case "STARTED":
        dispatch(appActions.setCommand(""))
        return dispatch(tasksActions.handleUpdateTask({
          id: selectedTask,
          status: "pending"
        }))
      case "FINISHED":
        dispatch(appActions.setCommand(""))
        return dispatch(tasksActions.handleUpdateTask({
          id: selectedTask,
          status: "done"
        }))
      default:
        return 0
    }
  }

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === "Enter") {
        chooseStatus(suggestedStatus[selection][0].toUpperCase()) 
      } else if (e.key === "ArrowUp") {
        if (selection > 0) {
          setSelection(selection - 1)
        }
      } else if (e.key === "ArrowDown") {
        if (selection < suggestedStatus.length - 1) {
          setSelection(selection + 1)
        }
      }
    }
    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [selection, suggestedStatus])

  useEffect(() => {
    setSelection(0)
  }, [commandParam])

  return (
    <>
      {suggestedStatus.map((x, i) => (
        <StatusSuggestion
          key={x}
          isSelected={selection === i}
          onMouseEnter={() => setSelection(i)}
          onClick={() => chooseStatus(x)}
        >
          <div>
            <span style={{ color: x[1], marginRight: 10 }}>⬤</span>
            <span>{x[0]}</span>
          </div>
        </StatusSuggestion>
      ))}
    </>
  );
};

const StatusSuggestion = styledComponents.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  background-color: ${({ isSelected }) => isSelected ? "#F5F5F5" : "transparent"};
  padding: 10px 20px;
  transition: background-color 0.2s;
  cursor: pointer;
  & > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    & > span:nth-child(1) {
      font-size: 18px;
    }
    & > span:nth-child(2) {
      color: #222222;
      font-weight: 600;
      font-size: 14px;
      text-transform: lowercase;
      &::first-letter {
        text-transform: capitalize;
      }
    }
  }
`

export default connect((state) => ({
	app: state.app,
	user: state.user
}))(Status);