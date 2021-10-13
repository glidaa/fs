import React from 'react';
import styled from "styled-components";
import { connect } from "react-redux";
import parseLinkedList from "../../utils/parseLinkedList";
import ProjectNotSelected from "./ProjectNotSelected";
import * as tasksActions from "../../actions/tasks";
import { OK, initTaskState } from "../../constants";
import ProjectTitle from './ProjectTitle';
import sortedTasks from './sortedTasks';
import ProjectToolbar from './ProjectToolbar';
import TasksToolbar from './TasksToolbar';

const TasksPanel = (props) => {
  const {
    app: {
      selectedProject,
      taskAddingStatus
    },
    appSettings: {
      tasksSortingCriteria
    },
    tasks,
    dispatch,
  } = props;
  const addNewTask = (e) => {
    e.target.getAttribute("name") === "TasksPanelContainer" &&
    taskAddingStatus === OK &&
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
      onClick={addNewTask}
    >
      {selectedProject ? (
        <>
          <ProjectToolbar />
          <ProjectTitle />
          <TasksToolbar />
          {React.createElement(sortedTasks[tasksSortingCriteria])}
        </>
      ) : <ProjectNotSelected />}
    </TasksPanelContainer>
  )
}

const TasksPanelContainer = styled.div`
  position: relative;
  flex: 2;
  padding: 20px 40px 20px 40px;
  overflow: auto;
  min-height: calc(100vh - 80px);
  background-color: #F8F8F8;
  @media only screen and (max-width: 768px) {
		padding: 0px;
    width: 100%;
    height: 100%;
  }
`

export default connect((state) => ({
  tasks: state.tasks,
  app: state.app,
  appSettings: state.appSettings
}))(TasksPanel);
