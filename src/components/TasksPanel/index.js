import React from 'react';
import styled from "styled-components";
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

const TasksPanel = (props) => {
  const {
    app: {
      selectedProject,
      taskAddingStatus
    },
    appSettings: {
      tasksSortingCriteria
    },
    status,
    tasks,
    dispatch,
  } = props;
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
    <TasksPanelContainer
      name="TasksPanelContainer"
      isReady={status.tasks === READY}
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
              <TasksToolbar />
              {React.createElement(sortedTasks[tasksSortingCriteria])}
            </>
          )}
        </>
      ) : <ProjectNotSelected />}
    </TasksPanelContainer>
  )
}

const TasksPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 2;
  padding: 20px 40px 20px 40px;
  overflow: auto;
  min-height: calc(100vh - 80px);
  opacity: ${({isReady}) => isReady ? 1 : 0.5};
  pointer-events: ${({isReady}) => isReady ? "all" : "none"};
  background-color: ${({theme}) => theme.tasksPanelBg};
  transition: opacity 0.3s;
  @media only screen and (max-width: 768px) {
		padding: 0px;
    width: 100%;
    min-height: 100%;
    max-height: 100%;
  }
`

export default connect((state) => ({
  tasks: state.tasks,
  app: state.app,
  status: state.status,
  appSettings: state.appSettings
}))(TasksPanel);
