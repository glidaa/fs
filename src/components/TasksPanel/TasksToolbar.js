import React, { useContext } from 'react';
import styled, { ThemeContext } from "styled-components";
import { connect } from "react-redux";
import * as tasksActions from "../../actions/tasks"
import * as appSettingsActions from "../../actions/appSettings";
import parseLinkedList from "../../utils/parseLinkedList"
import copyTask from "../../utils/copyTask"
import { ReactComponent as CalendarIcon } from "../../assets/calendar-outline.svg"
import { ReactComponent as ClipboardIcon } from "../../assets/clipboard-outline.svg"
import { ReactComponent as CheckmarkIcon } from "../../assets/checkmark-outline.svg"
import { ReactComponent as ListIcon } from "../../assets/list-outline.svg"

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
        <SortingSetting
          isSelected={tasksSortingCriteria === "BY_DEFAULT"}
          onClick={() => dispatch(
            appSettingsActions.handleSetTasksSortingCriteria(
              "BY_DEFAULT"
            )
          )}
        >
          <ListIcon
            width={14}
            height={14}
            strokeWidth={32}
            color={
              tasksSortingCriteria === "BY_DEFAULT" ?
              "#FFFFFF" : themeContext.primary
            }
          />
        </SortingSetting>
        <SortingSetting
          isSelected={tasksSortingCriteria === "BY_DUE"}
          onClick={() => dispatch(
            appSettingsActions.handleSetTasksSortingCriteria(
              "BY_DUE"
            )
          )}
        >
          <CalendarIcon
            width={14}
            height={14}
            strokeWidth={32}
            fill={
              tasksSortingCriteria === "BY_DUE" ?
              "#FFFFFF" : themeContext.primary
            }
            color={
              tasksSortingCriteria === "BY_DUE" ?
              "#FFFFFF" : themeContext.primary
            }
          />
        </SortingSetting>
        <SortingSetting
          isSelected={tasksSortingCriteria === "BY_STATUS"}
          onClick={() => dispatch(
            appSettingsActions.handleSetTasksSortingCriteria(
              "BY_STATUS"
            )
          )}
        >
          <CheckmarkIcon
            width={14}
            height={14}
            strokeWidth={32}
            stroke={
              tasksSortingCriteria === "BY_STATUS" ?
              "#FFFFFF" : themeContext.primary
            }
          />
        </SortingSetting>
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
  & > *:not(:last-child) {
    margin-right: 5px;
  }
`

const SortingSetting = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: ${({theme})=> theme.primary};
  font-size: 20px;
  outline: none;
  width: 33px;
  height: 33px;
  font-weight: 500;
  line-height: 0;
  padding: 0;
  cursor: pointer;
  border-radius: 8px;
  border: 1px solid ${({theme})=> theme.primary};
  background-color: ${({isSelected, theme})=> isSelected ? theme.primary : "#FFFFFF"};
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
