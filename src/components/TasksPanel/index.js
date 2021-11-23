import React, { useState } from 'react';
import styles from "./index.module.scss";
import { connect } from "react-redux";
import parseLinkedList from "../../utils/parseLinkedList";
import ProjectNotSelected from "./ProjectNotSelected";
import * as tasksActions from "../../actions/tasks";
import { READY, LOADING, initTaskState } from "../../constants";
import sortedTasks from './sortedTasks';
import ProjectToolbar from './ProjectToolbar';
import TasksToolbar from './TasksToolbar';
import NoTasks from './NoTasks';
import TasksSearch from './TasksSearch';
import ProjectHeader from './ProjectHeader';
import SimpleBar from 'simplebar-react';

const TasksPanel = (props) => {
  const {
    app: {
      selectedProject,
      isSynced
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
    (e.target.getAttribute("name") === "TasksPanelContainer" ||
    (e.target.className === "simplebar-content-wrapper" && document.querySelector("[name='TasksView']")?.contains(e.target)) ||
    document.querySelector("[name='NoTasks']")?.contains(e.target) && !Object.keys(tasks).length) &&
    status.tasks === READY &&
    isSynced &&
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
            <NoTasks msgID="LOADING" />
          ) : (
            <>
              <ProjectHeader />
              <TasksToolbar
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
              />
              
                {searchKeyword.trim() ? (
                  <TasksSearch searchKeyword={searchKeyword} />
                ) : Object.keys(tasks).length ? (
                  <SimpleBar name="TasksView" className={styles.TasksView}>
                    {React.createElement(sortedTasks[tasksSortingCriteria])}
                  </SimpleBar>
                 ) : isSynced ? (
                  <NoTasks msgID="EMPTY" />
                 ) : (
                   <NoTasks msgID="OFFLINE" />
                 )}
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
