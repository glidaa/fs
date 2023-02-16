import React, { useMemo } from 'react';
import { useSelector } from "react-redux";
import formatDate from '../../../utils/formatDate';
import sortByRank from "../../../utils/sortByRank";
import Accordion from '../../UI/Accordion';
import TaskItem from "../TaskItem";
import TaskPlaceholder from '../TaskPlaceholder';

const ByDue = () => {
  const tasks = useSelector(state => state.tasks);
  const getSortedTasks = (tasks) => {
    let result = {}
    const noDue = [];
    const defaultSorting = sortByRank(tasks)
    for (const task of defaultSorting) {
      if (task.due) {
        if (!result[task.due]) {
          result[task.due] = []
        }
        result[task.due].push(task)
      } else {
        noDue.push(task)
      }
    }
    result = Object.entries(result).map(x => [x[0], x[1]]);
    if (noDue.length) {
      result.push([0, noDue])
    }
    return result;
  }
  const sortedTasks = useMemo(() => getSortedTasks(tasks), [tasks])
  return (
    <>
      {sortedTasks.map((x, tagIndex) => (
        <Accordion title={x[0] ? formatDate(x[0]) : "No Due Date"} key={x[0]}>
          {x[1].map((value, taskIndex) => (
            <TaskItem
              key={value.id}
              item={value}
              nextTask={
                (x[1][taskIndex + 1]?.id !== value.id && x[1][taskIndex + 1]?.id) ||
                (sortedTasks[tagIndex + 1]?.[1][0].id !== value.id && sortedTasks[tagIndex + 1]?.[1][0].id) ||
                null
              }
              prevTask={
                (x[1][taskIndex - 1]?.id !== value.id && x[1][taskIndex - 1]?.id) ||
                (sortedTasks[tagIndex - 1]?.[1][0].id !== value.id && sortedTasks[tagIndex - 1]?.[1][0].id) ||
                null
              }
            />
          ))}
          <TaskPlaceholder
            content={
              x[0] ?
              "Tap to create new task due '" + formatDate(x[0]) + "'" :
              "Tap to create new task with no due date"
            }
            preset={{due: x[0] ? x[0] : null}}
          />
        </Accordion>
      ))}
    </>
  )
}

export default ByDue;