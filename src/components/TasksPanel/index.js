import React, { useState } from 'react';
import styles from "./index.module.scss";
import { connect } from "react-redux";
import parseLinkedList from "../../utils/parseLinkedList";
import ProjectNotSelected from "./ProjectNotSelected";
import * as tasksActions from "../../actions/tasks";
import { READY, LOADING, initTaskState } from "../../constants";
import ProjectTitle from './ProjectTitle';
import sortedTasks from './sortedTasks';
import ProjectToolbar from './ProjectToolbar';
import TasksToolbar from './TasksToolbar';
import TasksLoading from './TasksLoading';
import TasksSearch from './TasksSearch';

const TasksPanel = (props) => {
  const {
    app: {
      selectedProject
    },
    appSettings: {
      tasksSortingCriteria
    },
    status,
    tasks,
    dispatch,
  } = props;
  const [searchKeyword, setSearchKeyword] = useState("")
  const addNewTask = (e) => {
    e.target.getAttribute("name") === "TasksPanelContainer" &&
    status.tasks === READY &&
    dispatch(
      tasksActions.handleCreateTask(
        initTaskState(
          selectedProject,
          parseLinkedList(tasks, "prevTask", "nextTask").reverse()[0]?.id
        )
      )
    )
  }
  return (
    <div
      name="TasksPanelContainer"
      className={[
        styles.TasksPanelContainer,
        ...((status.tasks === READY ||
          status.tasks === LOADING) && [styles.ready] || [])
      ].join(" ")}
      onClick={addNewTask}
    >
      {selectedProject ? (
        <>
          <ProjectToolbar />
          {status.tasks === LOADING ? (
            <TasksLoading />
          ) : (
            <>
              <ProjectTitle />
              <TasksToolbar
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
              />
              {searchKeyword.trim() ? (
                <TasksSearch searchKeyword={searchKeyword} />
              ) : React.createElement(sortedTasks[tasksSortingCriteria])}
            </>
          )}
        </>
      ) : <ProjectNotSelected />}
    </div>
  )
}

export default connect((state) => ({
  tasks: state.tasks,
  app: state.app,
  status: state.status,
  appSettings: state.appSettings
}))(TasksPanel);
