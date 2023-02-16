import React, { useMemo } from 'react';
import { useSelector } from "react-redux";
import getTitleCase from '../../../utils/getTitleCase';
import sortByRank from "../../../utils/sortByRank";
import sortObj from '../../../utils/sortObj';
import Accordion from '../../UI/Accordion';
import TaskItem from "../TaskItem";
import TaskPlaceholder from '../TaskPlaceholder';

const ByStatus = () => {
  const tasks = useSelector(state => state.tasks);
  const statusSet = useSelector(state => state.projects[state.app.selectedProject].statusSet)
  const getId2Title = (statusSet) => Object.fromEntries(statusSet.map(x => [x.id, x.title]));
  const getSortedTasks = (tasks, statusSet) => {
    let result = Object.fromEntries(statusSet.map(x => [x.id, []]))
    const defaultSorting = sortByRank(tasks)
    for (const task of defaultSorting) {
      result[task.status].push(task)
    }
    result = sortObj(result)
    return Object.entries(result);
  }
  const id2title = useMemo(() => getId2Title(statusSet), [statusSet]);
  const sortedTasks = useMemo(() => getSortedTasks(tasks, statusSet), [tasks, statusSet]);
  return sortedTasks.map((x, statusIndex) => (
    <Accordion title={id2title[x[0]]} key={x[0]}>
      {x[1].map((value, taskIndex) => (
        <TaskItem
          key={value.id}
          item={value}
          nextTask={
            (x[1][taskIndex + 1]?.id !== value.id && x[1][taskIndex + 1]?.id) ||
            (sortedTasks[statusIndex + 1] && sortedTasks[statusIndex + 1][1][0]?.id) ||
            null
          }
          prevTask={
            (x[1][taskIndex - 1]?.id !== value.id && x[1][taskIndex - 1]?.id) ||
            (sortedTasks[statusIndex - 1] && sortedTasks[statusIndex - 1][1][sortedTasks[statusIndex - 1][1].length - 1]?.id) ||
            null
          }
        />
      ))}
      <TaskPlaceholder
        content={"Tap to create new task marked as '" + id2title[x[0]] + "'"}
        preset={{ status: x[0] }}
      />
    </Accordion>
  ))
}

export default ByStatus;