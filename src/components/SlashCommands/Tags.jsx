import React, { useEffect, useMemo } from 'react';
import styles from "./Tags.module.scss"
import * as tasksActions from "../../actions/tasks"
import { useDispatch, useSelector } from "react-redux";

const Tags = (props) => {
  const {
    commandParam,
    onCommandChange,
  } = props

  const dispatch = useDispatch()

  const selectedTask = useSelector(state => state.app.selectedTask);

  const tasks = useSelector(state => state.tasks);

  const getSuggestedTags = (commandParam) => {
    return commandParam ? [...new Set(commandParam.split(/(?:\s*,\s*)+/).filter(x => x))] : null
  }

  const suggestedTags = useMemo(() => getSuggestedTags(commandParam), [commandParam])

  const chooseTags = () => {
    if (suggestedTags){
      onCommandChange(null)
      dispatch(tasksActions.handleUpdateTask({
          id: selectedTask,
          action: "update",
          field: "tags",
          value: [...new Set([...tasks[selectedTask].tags, ...suggestedTags])]
      }))
    }
  }

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === "Enter") {
        e.preventDefault()
        e.stopPropagation()
        chooseTags() 
      }
    }
    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [suggestedTags, tasks, selectedTask])

  return (
    <div
      className={[
        styles.TagsSuggestion,
        ...(suggestedTags && [styles.active] || [])
      ].join(" ")}
      onClick={chooseTags}
    >
      {suggestedTags && (
        suggestedTags.map(x => (
          <span className={styles.TagItem} key={x}>
            {x}
          </span>
      )))}
      {!suggestedTags && (
        <span className={styles.NoTags}>
          Enter Comma Separated Tags
        </span>
      )}
    </div>
  );
};

export default Tags;