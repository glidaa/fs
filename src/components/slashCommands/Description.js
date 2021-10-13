import React, { useEffect, useMemo } from 'react';
import styled from "styled-components"
import * as tasksActions from "../../actions/tasks"
import * as appActions from "../../actions/app"
import { connect } from "react-redux";

const Description = (props) => {
  const {
    commandParam,
    app: {
      selectedTask
    },
    tasks,
    dispatch
  } = props

  const getSuggestedDescription = (commandParam) => {
    return commandParam
  }

  const suggestedDescription = useMemo(() => getSuggestedDescription(commandParam), [commandParam])

  const chooseDescription = () => {
    if (suggestedDescription){
      dispatch(appActions.setCommand(""))
      dispatch(tasksActions.handleUpdateTask({
          id: selectedTask,
          description: suggestedDescription
      }))
    }
  }

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === "Enter") {
        chooseDescription() 
      }
    }
    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [suggestedDescription, tasks, selectedTask])

  return (
    <DescriptionSuggestion
      isActive={suggestedDescription}
      onClick={chooseDescription}
    >
      {suggestedDescription && suggestedDescription}
      {!suggestedDescription && <NoDescription>Enter An Appropriate Description</NoDescription>}
    </DescriptionSuggestion>
  );
};

const DescriptionSuggestion = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  background-color: ${({ isActive }) => isActive ? "#F5F5F5" : "transparent"};
  padding: 10px 20px;
  cursor: pointer;
  & > *:not(:last-child) {
    margin-right: 5px;
  }
`

const NoDescription = styled.span`
  display: flex;
  width: 100%;
  font-size: 14px;
  align-items: center;
  justify-content: center;
`

export default connect((state) => ({
	app: state.app,
	tasks: state.tasks
}))(Description);