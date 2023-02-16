import React, { useMemo } from 'react';
import { useSelector } from "react-redux";
import getTitleCase from '../../../utils/getTitleCase';
import sortByRank from "../../../utils/sortByRank";
import sortObj from '../../../utils/sortObj';
import Accordion from '../../UI/Accordion';
import TaskItem from "../TaskItem";
import TaskPlaceholder from '../TaskPlaceholder';

const ByTag = () => {
  const tasks = useSelector(state => state.tasks);
  const getSortedTasks = (tasks) => {
    let result = {}
    const untagged = []
    const defaultSorting = sortByRank(tasks)
    for (const task of defaultSorting) {
      if (task.tags?.length) {
        for (const tag of task.tags) {
          const stdTag = getTitleCase(tag);
          if (!result[stdTag]) {
            result[stdTag] = []
          }
          result[stdTag].push(task)
        }
      } else {
        untagged.push(task)
      }
    }
    result = sortObj(result)
    if (untagged.length) {
      result.Untagged = untagged
    }
    return Object.entries(result);
  }
  const sortedTasks = useMemo(() => getSortedTasks(tasks), [tasks])
  return sortedTasks.map((x, tagIndex) => (
  <Accordion title={x[0]} key={x[0]}>
    {x[1].map((value, taskIndex) => (
      <TaskItem
        key={value.id}
        item={value}
        nextTask={
          (x[1][taskIndex + 1]?.id !== value.id && x[1][taskIndex + 1]?.id) ||
          ((sortedTasks[tagIndex + 1] && [...sortedTasks[tagIndex + 1][1]].find(x => x.id !== value.id)?.id)) ||
          null
        }
        prevTask={
          (x[1][taskIndex - 1]?.id !== value.id && x[1][taskIndex - 1]?.id) ||
          ((sortedTasks[tagIndex - 1] && [...sortedTasks[tagIndex - 1][1]].reverse().find(x => x.id !== value.id)?.id)) ||
          null
        }
      />
    ))}
    <TaskPlaceholder
      content={
        x[0] === "Untagged" ?
        "Tap to create new untagged task" :
        "Tap to create new task tagged with '" + x[0] + "'"
      }
      preset={{tags: x[0] === "Untagged" ? [] : [x[0]]}}
    />
  </Accordion>
))
}

export default ByTag;