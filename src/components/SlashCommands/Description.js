import React, { useEffect, useMemo } from 'react';
import styles from "./Description.module.scss"
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
    <div
      className={[
        styles.DescriptionSuggestion,
        ...(suggestedDescription && [styles.active] || [])
      ].join(" ")}
      onClick={chooseDescription}
    >
      {suggestedDescription && suggestedDescription}
      {!suggestedDescription && (
        <span className={styles.NoDescription}>
          Enter An Appropriate Description
        </span>
      )}
    </div>
  );
};

export default connect((state) => ({
	app: state.app,
	tasks: state.tasks
}))(Description);