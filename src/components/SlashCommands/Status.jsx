import React, { useState, useEffect, useMemo } from 'react';
import styles from "./Status.module.scss"
import * as tasksActions from "../../actions/tasks"
import { useDispatch, useSelector } from "react-redux";

const statusColors = {
  "todo": "var(--color-fill-color-system-critical)",
  "pending": "var(--color-fill-color-system-caution)",
  "done": "var(--color-fill-color-system-success)",
}

const Status = (props) => {
  const {
    commandParam,
    onCommandChange,
    scrollableNodeRef,
  } = props

  const dispatch = useDispatch()

  const selectedTask = useSelector(state => state.app.selectedTask);

  const statusSet = useSelector(state => state.projects[state.app.selectedProject].statusSet);

  const getSupportedStatus = (statusSet) => {
    const todoStatus = statusSet.filter(status => status.synonym === "todo").sort((a, b) => a.title - b.title);
    const pendingStatus = statusSet.filter(status => status.synonym === "pending").sort((a, b) => a.title - b.title);
    const doneStatus = statusSet.filter(status => status.synonym === "done").sort((a, b) => a.title - b.title);
    return [...todoStatus, ...pendingStatus, ...doneStatus];
  }

  const supportedStatus = useMemo(() => getSupportedStatus(statusSet), [statusSet]);

  const getSuggestedStatus = (commandParam) => {
    return supportedStatus.filter(x => new RegExp(`^${commandParam || ".*"}`, "i").test(x.title))
  }

  const suggestedStatus = useMemo(() => getSuggestedStatus(commandParam), [commandParam])

  const [selection, setSelection] = useState(0)

  const chooseStatus = (selectedStatus) => {
    onCommandChange(null)
    return dispatch(tasksActions.handleUpdateTask({
      id: selectedTask,
      action: "update",
      field: "status",
      value: selectedStatus
    }))
  }

  useEffect(() => {
    const handleKeyUp = (e) => {
      const scrollableElem = scrollableNodeRef?.current
      const scrollableElemHeight = scrollableElem?.getBoundingClientRect().height
      if (e.key === "Enter") {
        e.preventDefault()
        e.stopPropagation()
        chooseStatus(suggestedStatus[selection].id) 
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        e.stopPropagation()
        if (selection > 0) {
          const minHeight = scrollableElem?.scrollTop - 47 * (selection - 1) + scrollableElemHeight - 15
          if (scrollableElemHeight < minHeight) {
            scrollableElem?.scrollBy(0, scrollableElemHeight - minHeight)
          }
          setSelection(selection - 1)
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        e.stopPropagation()
        if (selection < suggestedStatus.length - 1) {
          const minHeight = 15 + 47 * (selection + 2) - scrollableElem?.scrollTop
          if (scrollableElemHeight < minHeight) {
            scrollableElem?.scrollBy(0, minHeight - scrollableElemHeight)
          }
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
        <div
          className={[
            styles.StatusSuggestion,
            ...(selection === i && [styles.selected] || [])
          ].join(" ")}
          key={x}
          onMouseEnter={() => setSelection(i)}
          onClick={() => chooseStatus(x.id)}
        >
          <div>
            <span style={{ color: statusColors[x.synonym], marginRight: 10 }}>⬤</span>
            <span>{x.title}</span>
          </div>
        </div>
      ))}
    </>
  );
};

export default Status;