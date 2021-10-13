import React, { useMemo } from 'react';
import { connect } from "react-redux";
import parseLinkedList from "../../../utils/parseLinkedList";
import TaskItem from "../TaskItem";

const ByDue = (props) => {
  const { tasks } = props;
  const getSortedTasks = (tasks) => {
    return parseLinkedList(tasks, "prevTask", "nextTask").sort(
      (a, b) => (b.due || 0) - (a.due || 0)
    )
  }
  const sortedTasks = useMemo(() => getSortedTasks(tasks), [tasks])
  return (
    <div>
      {sortedTasks.map((value, index) => (
        <div key={value.id}>
          <TaskItem
            item={value}
            isSorting={false}
            isDragging={false}
            nextTask={sortedTasks[index + 1]?.id || null}
            prevTask={sortedTasks[index - 1]?.id || null}
          />
        </div>
      ))}
    </div>
  )
}

export default connect((state) => ({
  tasks: state.tasks
}))(ByDue);