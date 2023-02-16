import React, { useEffect, useMemo } from 'react';
import styles from "./Description.module.scss"
import * as tasksActions from "../../actions/tasks"
import { useDispatch, useSelector } from "react-redux";

const Description = (props) => {
  const {
    commandParam,
    onCommandChange,
  } = props

  const dispatch = useDispatch()

  const selectedTask = useSelector(state => state.app.selectedTask);

  const tasks = useSelector(state => state.tasks);

  const getSuggestedDescription = (commandParam) => {
    return commandParam
  }

  const suggestedDescription = useMemo(() => getSuggestedDescription(commandParam), [commandParam])

  const chooseDescription = () => {
    if (suggestedDescription){
      onCommandChange(null)
      dispatch(tasksActions.handleUpdateTask({
          id: selectedTask,
          action: "update",
          field: "description",
          value: suggestedDescription
      }))
    }
  }

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === "Enter") {
        e.preventDefault()
        e.stopPropagation()
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

export default Description;