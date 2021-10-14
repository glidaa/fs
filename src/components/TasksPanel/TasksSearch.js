import React, { useMemo } from 'react';
import { connect } from "react-redux";
import Fuse from "fuse.js"
import parseLinkedList from "../../utils/parseLinkedList";
import TaskItem from "./TaskItem";

const TasksSearch = (props) => {
  const { tasks, searchKeyword } = props;
  const getSearchResults = (tasks, searchKeyword) => {
    const sortedTasks = parseLinkedList(tasks, "prevTask", "nextTask").sort(
      (a, b) => (b.due || 0) - (a.due || 0)
    )
    const fuse = new Fuse(sortedTasks, {
        keys: ['task', 'description']
    })
    return fuse.search(searchKeyword).map(x => x.item)
  }
  const searchResults = useMemo(() => getSearchResults(tasks, searchKeyword), [tasks, searchKeyword])
  return (
    <div>
      {searchResults.map((value, index) => (
        <div key={value.id}>
          <TaskItem
            item={value}
            isSorting={false}
            isDragging={false}
            nextTask={searchResults[index + 1]?.id || null}
            prevTask={searchResults[index - 1]?.id || null}
          />
        </div>
      ))}
    </div>
  )
}

export default connect((state) => ({
  tasks: state.tasks
}))(TasksSearch);