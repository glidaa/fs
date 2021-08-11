import { AuthState } from '@aws-amplify/ui-components';
import * as tasksActions from "./tasks"
import * as observersActions from "./observers"
import * as commentsActions from "./comments"
import {
  commandIntents,
  supportedCommands
} from "../constants";
import copyTask from "../utils/copyTask";
import parseLinkedList from "../utils/parseLinkedList";

export const SET_PROJECT = "SET_PROJECT";
export const SET_TASK = "SET_TASK";
export const SET_COMMAND = "SET_COMMAND";
export const SET_DROPDOWN = "SET_DROPDOWN";
export const SET_PROJECT_ADDING_STATUS = "SET_PROJECT_ADDING_STATUS";
export const SET_TASK_ADDING_STATUS = "SET_TASK_ADDING_STATUS";
export const SET_HISTORY = "SET_HISTORY";
export const SET_LOADING = "SET_LOADING";
export const SET_PROJECT_PANEL = "SET_PROJECT_PANEL";
export const SET_DETAILS_PANEL = "SET_DETAILS_PANEL";
export const SET_ACTION_SHEET = "SET_ACTION_SHEET";
export const SET_PROJECT_TITLE = "SET_PROJECT_TITLE";
export const SET_LOCKED_TASK_FIELD = "SET_LOCKED_TASK_FIELD";

const setProject = (id, scope) => ({
  type: SET_PROJECT,
  id,
  scope
});

const setTask = (id) => ({
  type: SET_TASK,
  id
});

const setCommand = (command, intent) => ({
  type: SET_COMMAND,
  command,
  intent
});


const setProjectTitle = (status) => ({
  type: SET_PROJECT_TITLE,
  status
});

const setProjectsPanel = (status) => ({
  type: SET_PROJECT_PANEL,
  status
});

const setDetailsPanel = (status) => ({
  type: SET_DETAILS_PANEL,
  status
});

export const setLockedTaskField = (fieldName) => ({
  type: SET_LOCKED_TASK_FIELD,
  fieldName
});

export const setDropdown = (status) => ({
  type: SET_DROPDOWN,
  status
});

export const setProjectAddingStatus = (status) => ({
  type: SET_PROJECT_ADDING_STATUS,
  status
});

export const setTaskAddingStatus = (status) => ({
  type: SET_TASK_ADDING_STATUS,
  status
});

export const setHistory = (history) => ({
  type: SET_HISTORY,
  history
});

export const setLoading = (isLoading) => ({
  type: SET_LOADING,
  isLoading
});

export const setActionSheet = (status) => ({
  type: SET_ACTION_SHEET,
  status
});

export const handleSetProject = (id, shouldChangeURL = true) => (dispatch, getState) => {
  const { user, app, projects } = getState()
  if (app.selectedProject !== id) {
    dispatch(observersActions.handleClearTasksObservers())
    dispatch(handleSetTask(null));
    dispatch(tasksActions.emptyTasks());
    if (id) {
      if (projects["owned"][id]) {
        dispatch(setProject(id, "owned"))
        if (shouldChangeURL) {
          if (user.state === AuthState.SignedIn) {
            app.history.push(`/${projects["owned"][id].permalink}`)
          } else {
            app.history.push(`/local/${projects["owned"][id].permalink}`)
          }
        }
      } else if (projects["assigned"][id]) {
        dispatch(setProject(id, "assigned"))
        if (shouldChangeURL) {
          app.history.push(`/${projects["assigned"][id].permalink}`)
        }
      }
      dispatch(tasksActions.handleFetchTasks(id))
      if (user.state === AuthState.SignedIn) {
        dispatch(observersActions.handleSetTasksObservers(id))
      }
    } else {
      if (shouldChangeURL) {
        app.history.push("/")
      }
      dispatch(setProject(null, null))
    }
  }
}

export const handleSetTask = (id, shouldChangeURL = true) => (dispatch, getState) => {
  const { user, projects, tasks, app } = getState()
  dispatch(observersActions.handleClearCommentsObservers())
  dispatch(setProjectTitle(false))
  if (!id && app.selectedTask) {
    if (shouldChangeURL) {
      if (app.selectedProject && user.state === AuthState.SignedIn) {
        app.history.push(`/${projects[app.selectedProjectScope][app.selectedProject].permalink}`)
      }
    }
    dispatch(setCommand(""))
    dispatch(setDropdown(false))
    dispatch(setTask(null))
  } else if (!id) {
    if (app.isDetailsPanelOpened) {
      dispatch(setDetailsPanel(false))
    }
    dispatch(setTask(null))
  } else {
    if (shouldChangeURL) {
      if (app.selectedProject && user.state === AuthState.SignedIn) {
        app.history.push(`/${projects[app.selectedProjectScope][app.selectedProject].permalink}/${tasks[id].permalink}`)
      }
    }
    dispatch(setTask(id))
    dispatch(setLockedTaskField("task"))
    dispatch(commentsActions.handleFetchComments(id))
    if (user.state === AuthState.SignedIn) {
      dispatch(observersActions.handleSetCommentsObservers(id))
    }
  }
}

export const handleSetProjectTitle = (status) => (dispatch) => {
  if (status) {
    dispatch(handleSetTask(null))
  }
  return dispatch(setProjectTitle(status))
}

export const handleSetDetailsPanel = (status) => (dispatch, getState) => {
  const { app: { isProjectsPanelOpened } } = getState()
  if (status && isProjectsPanelOpened) {
    dispatch(setProjectsPanel(false))
  }
  return dispatch(setDetailsPanel(status))
}

export const handleSetProjectsPanel = (status) => (dispatch, getState) => {
  const { app: { isDetailsPanelOpened } } = getState()
  if (status && isDetailsPanelOpened) {
    dispatch(setDetailsPanel(false))
  }
  return dispatch(setProjectsPanel(status))
}

export const handleSetCommand = (command) => (dispatch) => {
  if (command) {
    const tokens = /^\/(\w*)\s*(.*)\s*$/m.exec(command)
    dispatch(setDropdown(false))
    switch (tokens[1]) {
      case supportedCommands.ASSIGN:
        dispatch(setCommand(command, commandIntents.ASSIGN))
        break
      case supportedCommands.STATUS:
        dispatch(setCommand(command, commandIntents.STATUS))
        break
      case supportedCommands.DESCRIPTION:
        dispatch(setCommand(command, commandIntents.DESCRIPTION))
        break
      case supportedCommands.DUE:
        dispatch(setCommand(command, commandIntents.DUE))
        break
      case supportedCommands.TAGS:
        dispatch(setCommand(command, commandIntents.TAGS))
        break
      case supportedCommands.DUPLICATE:
        dispatch(setCommand(command, commandIntents.DUPLICATE))
        break
      case supportedCommands.COPY:
        dispatch(setCommand(command, commandIntents.COPY))
        break
      case supportedCommands.DELETE:
        dispatch(setCommand(command, commandIntents.DELETE))
        break
      default:
        dispatch(setDropdown(true))
        return dispatch(setCommand(`/${tokens[1]}`, commandIntents.UNKNOWN))
    }
  }
}

export const handleApplyCommand = () => (dispatch, getState) => {
  const { user, tasks, app } = getState()
  dispatch(setCommand("", null))
  if (app.command) {
    const tokens = /^\/(\w*)\s*(.*)\s*$/m.exec(app.command)
    dispatch(setDropdown(false))
    switch (tokens[1]) {
      case supportedCommands.STATUS:
        dispatch(tasksActions.handleUpdateTask({
          id: app.selectedTask,
          status: tokens[2]
        }))
        break
      case supportedCommands.DESCRIPTION:
        return dispatch(tasksActions.handleUpdateTask({
          id: app.selectedTask,
          description: tokens[2].trim()
        }))
      case supportedCommands.DUE:
        return dispatch(tasksActions.handleUpdateTask({
          id: app.selectedTask,
          due: (new Date(tokens[2])).getTime()
        }))
      case supportedCommands.TAGS:
        return dispatch(tasksActions.handleUpdateTask({
          id: app.selectedTask,
          tag: [
            ...tasks[app.selectedTask].tags,
            ...tokens[2].split(",").map(x => x.trim())
          ]
        }))
      case supportedCommands.DUPLICATE:
        dispatch(tasksActions.handleCreateTask(
          copyTask(
            tasks[app.selectedTask],
            app.selectedProject,
            parseLinkedList(
              tasks,
              "prevTask",
              "nextTask"
            ).reverse()[0]?.id
          )
        ))
        return dispatch(handleSetTask(null))
      case supportedCommands.COPY:
        window.localStorage.setItem("tasksClipboard",
          "COPIEDTASKSTART=>" +
          JSON.stringify(tasks[app.selectedTask]) +
          "<=COPIEDTASKEND"
        )
        return dispatch(handleSetTask(null))
      case "/":
        dispatch(setDropdown(true))
        return dispatch(setCommand(app.command))
      default:
        dispatch(setDropdown(true))
        return dispatch(setCommand("/"))
    }
  }
}