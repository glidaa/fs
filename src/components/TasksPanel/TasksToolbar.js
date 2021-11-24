import React from 'react';
import styles from "./TasksToolbar.module.scss";
import { connect } from "react-redux";
import * as tasksActions from "../../actions/tasks"
import * as appActions from "../../actions/app";
import * as appSettingsActions from "../../actions/appSettings";
import parseLinkedList from "../../utils/parseLinkedList"
import copyTask from "../../utils/copyTask"
import { ReactComponent as ClipboardIcon } from "../../assets/clipboard-outline.svg"
import { ReactComponent as SearchIcon } from "../../assets/search-outline.svg"
import Dropdown from '../UI/fields/Dropdown';
import HeadingTextField from '../UI/fields/HeadingTextField';

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
    <div className={styles.ToolbarContainer}>
      <button
        className={styles.PasteBtn}
        onClick={pasteTask}
      >
        <ClipboardIcon
          width={14}
          height={14}
        />
        <span>Paste</span>
      </button>
      <HeadingTextField
        name="searchKeyword"
        placeholder="Search tasks…"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        onFocus={() => dispatch(appActions.handleSetTask(null))}
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
      <div className={styles.SortingSettings}>
        <span>Sorted By</span>
        <Dropdown
          onChange={handleChangeSortingCriteria}
          value={tasksSortingCriteria}
          options={{
            BY_DEFAULT: "default",
            BY_DUE: "due",
            BY_STATUS: "status",
            BY_PRIORITY: "priority",
            BY_TAG: "tag"
          }}
        />
      </div>
    </div>     
  )
}

export default connect((state) => ({
  app: state.app,
  tasks: state.tasks,
  appSettings: state.appSettings
}))(TasksToolbar);
