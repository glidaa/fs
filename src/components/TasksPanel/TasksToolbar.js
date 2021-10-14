import React, { useContext } from 'react';
import styled, { ThemeContext } from "styled-components";
import { connect } from "react-redux";
import * as tasksActions from "../../actions/tasks"
import * as appSettingsActions from "../../actions/appSettings";
import parseLinkedList from "../../utils/parseLinkedList"
import copyTask from "../../utils/copyTask"
import { ReactComponent as ClipboardIcon } from "../../assets/clipboard-outline.svg"
import Dropdown from '../UI/fields/Dropdown';

const TasksToolbar = (props) => {
  const {
    app,
    tasks,
    appSettings: {
      tasksSortingCriteria
    },
    dispatch,
  } = props;
  const themeContext = useContext(ThemeContext);
  const pasteTask = () => {
    const tasksClipboardData = window.localStorage.getItem("tasksClipboard")
    if (tasksClipboardData) {
      const stringifiedTaskState = /COPIEDTASKSTART=>({.+})<=COPIEDTASKEND/.exec(tasksClipboardData)[1]
      if (stringifiedTaskState) {
        const taskState = JSON.parse(stringifiedTaskState)
        if (taskState) {
          dispatch(tasksActions.handleCreateTask(
              copyTask(
                taskState,
                app.selectedProject,
                parseLinkedList(
                  tasks,
                  "prevTask",
                  "nextTask"
                ).reverse()[0]?.id
              )
            )
          )
        }
      }
    }
  }
  const handleChangeSortingCriteria = (e) => {
    dispatch(
      appSettingsActions.handleSetTasksSortingCriteria(
        e.target.value
      )
    )
  }
  return (
    <ToolbarContainer>
      <PasteBtn onClick={pasteTask}>
        <ClipboardIcon
          width={14}
          height={14}
          strokeWidth={32}
          color="#FFFFFF"
        />
        <span>Paste</span>
      </PasteBtn>
      <SortingSettings>
        <span>Sorted By</span>
        <Dropdown
          onChange={handleChangeSortingCriteria}
          value={tasksSortingCriteria}
          options={{
            BY_DEFAULT: "default",
            BY_DUE: "due",
            BY_STATUS: "status"
          }}
        />
      </SortingSettings>
    </ToolbarContainer>     
  )
}

const ToolbarContainer = styled.div`
  display: flex;
  background-color: #FFFFFF;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  margin: 0 12px 12px 12px;
  padding: 10px;
  border-radius: 15px;
  & > span {
    font-size: 12px;
  }
	@media only screen and (max-width: 768px) {
    margin: 0 12px 9px 12px;
	}
`

const SortingSettings = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  & > div {
    width: 120px;
  }
  & > *:not(:last-child) {
    margin-right: 8px;
  }
`

const PasteBtn = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 5px;
  line-height: 0;
  padding: 8px 15px;
  color: #FFFFFF;
  border: none;
  outline: none;
  cursor: pointer;
  border-radius: 6px;
  background-color: ${({theme})=> theme.primary};
  & > *:not(:last-child) {
    margin-right: 3px;
  }
`

export default connect((state) => ({
  app: state.app,
  tasks: state.tasks,
  appSettings: state.appSettings
}))(TasksToolbar);
