import React, { useEffect, useMemo } from 'react';
import styles from "./Tags.module.scss"
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

export default connect((state) => ({
	app: state.app,
	tasks: state.tasks
}))(Tags);