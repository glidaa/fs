import React, { useState } from 'react';
import styled from "styled-components";
import { connect } from "react-redux";
import * as tasksActions from "../../actions/tasks"
import * as appSettingsActions from "../../actions/appSettings";
import parseLinkedList from "../../utils/parseLinkedList"
import copyTask from "../../utils/copyTask"
import { ReactComponent as ClipboardIcon } from "../../assets/clipboard-outline.svg"
import { ReactComponent as SearchIcon } from "../../assets/search-outline.svg"
import Dropdown from '../UI/fields/Dropdown';
import TextField from '../UI/fields/TextField';

const TasksToolbar = (props) => {
  const {
    app,
    tasks,
    appSettings: {
      tasksSortingCriteria
    },
    searchKeyword,
    setSearchKeyword,
    dispatch,
  } = props;
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
      <TextField
        name="searchKeyword"
        placeholder="Search tasks…"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        prefix={() => (
          <SearchIcon
            width={18}
            height={18}
            strokeWidth={32}
            style={{
              marginRight: 5
            }}
          />
        )}
        style={{
          flex: 1
        }}
      />
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
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  margin: 0 12px 12px 12px;
  padding: 10px 0;
  border-radius: 15px;
  & > span {
    font-size: 12px;
  }
  & > *:not(:last-child) {
    margin-right: 10px;
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
  & > span {
    color: ${({theme})=> theme.txtColor};
  }
  & > div {
    width: 90px;
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
	@media only screen and (max-width: 768px) {
    & > span {
      display: none;
    }
    & > *:not(:last-child) {
      margin-right: 0;
    }
	}
`

export default connect((state) => ({
  app: state.app,
  tasks: state.tasks,
  appSettings: state.appSettings
}))(TasksToolbar);
