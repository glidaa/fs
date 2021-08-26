import React, { useEffect, useMemo } from 'react';
import styledComponents from "styled-components"
import * as tasksActions from "../../actions/tasks"
import * as appActions from "../../actions/app"
import { connect } from "react-redux";

const Due = (props) => {
  const {
    commandParam,
    app: {
      selectedTask
    },
    tasks,
    dispatch
  } = props

  const getSuggestedDue = (commandParam) => {
    const day = /^(\d{1,2})[-\d]*$/.exec(commandParam)?.[1]
    const month = /^\d{2}-(\d{1,2})[-\d]*$/.exec(commandParam)?.[1]
    const year = /^[-\d]*(\d{1,4})$/.exec(commandParam)?.[1]
    return ((day && day[0]) || "D") + ((day && day[1]) || "D") + "-" +
           ((month && month[0]) || "M") + ((month && month[1]) || "M") + "-" +
           ((year && year[0]) || "Y") + ((year && year[1]) || "Y") +
           ((year && year[2]) || "Y") + ((year && year[3]) || "Y")
  }

  const suggestedDue = useMemo(() => getSuggestedDue(commandParam), [commandParam])

  const chooseDue = () => {
    dispatch(appActions.setCommand(""))
    dispatch(tasksActions.handleUpdateTask({
        id: selectedTask,
        due: [...new Set([...tasks[selectedTask], ...suggestedDue])]
    }))
  }

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === "Enter") {
        chooseDue() 
      }
    }
    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [])

  return (
    <DueSuggestion>
        <span>due {suggestedDue}</span>
    </DueSuggestion>
  );
};

const DueSuggestion = styledComponents.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  background-color: #F5F5F5;
  padding: 10px 20px;
  cursor: pointer;
`

export default connect((state) => ({
	app: state.app,
	tasks: state.tasks
}))(Due);