import React, { useEffect, useMemo } from 'react';
import styles from "./Due.module.scss"
import * as tasksActions from "../../actions/tasks"
import { useDispatch, useSelector } from 'react-redux';

const Due = (props) => {
  const {
    commandParam,
    onCommandChange,
  } = props

  const dispatch = useDispatch()

  const selectedTask = useSelector(state => state.app.selectedTask);

  const getSuggestedDue = (commandParam) => {
    const isValidPattern = /^((\d{1,2}\/?)|(\d{2}\/\d{1,2}\/?)|(\d{2}\/\d{2}\/\d{1,4})|())$/.test(commandParam)
    if (isValidPattern) {
      const month = /^(\d{1,2})[/\d]*$/.exec(commandParam)?.[1]
      const parsedMonth = parseInt(month, 10)
      if (!isNaN(parsedMonth) && ((month.length === 1 && parsedMonth > 1) ||
        (month.length === 2 && (parsedMonth < 1 || parsedMonth > 12)))) {
        return null
      }
      const day = /^\d{2}\/(\d{1,2})[/\d]*$/.exec(commandParam)?.[1]
      const parsedDay = parseInt(day, 10)
      if (!isNaN(parsedDay) && (
        (day.length === 2 && parsedDay < 1) ||
        ([1, 3, 5, 7, 8, 10, 12].includes(parsedMonth) &&
        ((day.length === 1 && parsedDay > 3) ||
        (day.length === 2 && parsedDay > 31))) ||
        (parsedMonth === 2 && ((day.length === 1 && parsedDay > 2) ||
        (day.length === 2 && parsedDay > 29))) ||
        ([4, 6, 9, 11].includes(parsedMonth) && parsedDay > 30)
      )) {
        return null
      }
      const year = /^\d{2}\/\d{2}\/(\d{1,4})$/.exec(commandParam)?.[1]
      const parsedYear = parseInt(year, 10)
      if (!isNaN(parsedYear) && year.length === 4 && (parsedMonth === 2 && parsedDay > 28 &&
        !((0 === parsedYear % 4) && (0 !== parsedYear % 100) || (0 === parsedYear % 400)))) {
          return null
      }
      return ((month && month[0]) || "M") + ((month && month[1]) || "M") + "/" +
            ((day && day[0]) || "D") + ((day && day[1]) || "D") + "/" +
            ((year && year[0]) || "Y") + ((year && year[1]) || "Y") +
            ((year && year[2]) || "Y") + ((year && year[3]) || "Y")
    } else {
      return null
    }
  }

  const suggestedDue = useMemo(() => getSuggestedDue(commandParam), [commandParam])

  const chooseDue = () => {
    const dateObj = new Date(suggestedDue);
    if (suggestedDue && dateObj != "Invalid Date") {
      onCommandChange(null)
      dispatch(tasksActions.handleUpdateTask({
          id: selectedTask,
          action: "update",
          field: "due",
          value: dateObj.toISOString()
      }))
    }
  }

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === "Enter") {
        e.preventDefault()
        e.stopPropagation()
        chooseDue()
      }
    }
    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [suggestedDue, selectedTask])

  return (
    <div
      className={[
        styles.DueSuggestion,
        ...(suggestedDue && [styles.active] || [])
      ].join(" ")}
      onClick={chooseDue}
    >
        {suggestedDue && <span>due {suggestedDue}</span>}
        {!suggestedDue && (
          <span className={styles.NoDue}>
            Date must be in format MM/DD/YYYY
          </span>
        )}
    </div>
  );
};

export default Due;