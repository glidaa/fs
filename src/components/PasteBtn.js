import React from 'react';
import styledComponents from "styled-components"
import { connect } from "react-redux"
import * as tasksActions from "../actions/tasks"
import { ReactComponent as pasteIcon } from "../assets/clipboard-outline.svg"
import parseLinkedList from "../utils/parseLinkedList"
import copyTask from "../utils/copyTask"

const PasteBtn = (props) => {
  const { app, tasks, dispatch } = props
  return (
    <PasteBtnCore
      width="20"
      height="20"
      strokeWidth="32"
      color="#222222"
      onClick={() => {
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
      }}
    />
  )
}

const PasteBtnCore = styledComponents(pasteIcon)`
  float: right;
  border-radius: 100%;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #E4E4E2;
  }
`

export default connect((state) => ({
  user: state.user,
  tasks: state.tasks,
  app: state.app
}))(PasteBtn);