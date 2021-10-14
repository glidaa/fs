import React, { useEffect, useMemo } from 'react';
import styled from "styled-components"
import * as tasksActions from "../../actions/tasks"
import * as appActions from "../../actions/app"
import { connect } from "react-redux";

const Tags = (props) => {
  const {
    commandParam,
    app: {
      selectedTask
    },
    tasks,
    dispatch
  } = props

  const getSuggestedTags = (commandParam) => {
    return commandParam ? [...new Set(commandParam.split(/(?:\s*,\s*)+/).filter(x => x))] : null
  }

  const suggestedTags = useMemo(() => getSuggestedTags(commandParam), [commandParam])

  const chooseTags = () => {
    if (suggestedTags){
      dispatch(appActions.setCommand(""))
      dispatch(tasksActions.handleUpdateTask({
          id: selectedTask,
          tags: [...new Set([...tasks[selectedTask].tags, ...suggestedTags])]
      }))
    }
  }

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === "Enter") {
        chooseTags() 
      }
    }
    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [suggestedTags, tasks, selectedTask])

  return (
    <TagsSuggestion
      isActive={suggestedTags}
      onClick={chooseTags}
    >
      {suggestedTags && suggestedTags.map(x => <TagItem key={x}>{x}</TagItem>)}
      {!suggestedTags && <NoTags>Enter Comma Separated Tags</NoTags>}
    </TagsSuggestion>
  );
};

const TagsSuggestion = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  background-color: ${({ isActive }) => isActive ? "#F5F5F5" : "transparent"};
  padding: 10px 20px;
  cursor: pointer;
  & > *:not(:last-child) {
    margin-right: 5px;
  }
`

const TagItem = styled.span`
  display: inline-flex;
  padding: 5px 10px;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 14px;
  width: fit-content;
  height: fit-content;
  color: ${({theme})=> theme.primary};
  background-color: ${({theme})=> theme.primaryLight};
  flex-direction: row;
  align-items: center;
`

const NoTags = styled.span`
  display: flex;
  width: 100%;
  font-size: 14px;
  align-items: center;
  justify-content: center;
`

export default connect((state) => ({
	app: state.app,
	tasks: state.tasks
}))(Tags);