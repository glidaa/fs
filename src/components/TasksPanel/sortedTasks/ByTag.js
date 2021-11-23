import React, { useMemo } from 'react';
import { connect } from "react-redux";
import getTitleCase from '../../../utils/getTitleCase';
import parseLinkedList from "../../../utils/parseLinkedList";
import sortObj from '../../../utils/sortObj';
import Accordion from '../../UI/Accordion';
import TaskItem from "../TaskItem";

const ByTag = (props) => {
  const { tasks } = props;
  const getSortedTasks = (tasks) => {
    let result = {}
    const untagged = []
    const defaultSorting = parseLinkedList(tasks, "prevTask", "nextTask")
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
  return (
    <>
      {sortedTasks.map((x, tagIndex) => (
        <Accordion title={x[0]} key={x[0]}>
          {x[1].map((value, taskIndex) => (
            <div key={value.id}>
              <TaskItem
                item={value}
                isSorting={false}
                isDragging={false}
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
            </div>
          ))}
        </Accordion>
      ))}
    </>
  )
}

export default connect((state) => ({
  tasks: state.tasks
}))(ByTag);