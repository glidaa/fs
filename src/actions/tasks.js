import { API, graphqlOperation } from "aws-amplify";
import { AuthState } from '@aws-amplify/ui-components';
import { listTasksForProject } from "../graphql/queries"
import injectItemOrder from "../utils/injectItemOrder"
import removeItemOrder from "../utils/removeItemOrder"
import * as appActions from "./app"
import * as usersActions from "./users"
import * as mutations from "../graphql/mutations"
import { DONE, ERROR, NOT_ASSIGNED, NOT_STARTED, OK, PENDING } from "../constants";
import prepareTaskToBeSent from "../utils/prepareTaskToBeSent";

export const CREATE_TASK = "CREATE_TASK";
export const UPDATE_TASK = "UPDATE_TASK";
export const REMOVE_TASK = "REMOVE_TASK";
export const EMPTY_TASKS = "EMPTY_TASKS";
export const FETCH_TASKS = "FETCH_TASKS";

export const createTask = (taskState) => ({
  type: CREATE_TASK,
  taskState
});

export const updateTask = (update) => ({
  type: UPDATE_TASK,
  update
});

export const removeTask = (id) => ({
  type: REMOVE_TASK,
  id
});

export const emptyTasks = () => ({
  type: EMPTY_TASKS
});

const fetchTasks = (tasks) => ({
  type: FETCH_TASKS,
  tasks
});

export const handleCreateTask = (taskState) => (dispatch, getState) => {
  const { user } = getState()
  if (user.state === AuthState.SignedIn) {
    dispatch(appActions.setTaskAddingStatus(PENDING))
    const dataToSend = prepareTaskToBeSent(taskState)
    return API.graphql(graphqlOperation(mutations.createTask, { input: dataToSend }))
      .then((incoming) => {
        if (taskState.projectID === getState().app.selectedProject) {
          dispatch(createTask(incoming.data.createTask))
          if (taskState.projectID === getState().app.selectedProject) {
            dispatch(appActions.handleSetTask(null))
          }
          dispatch(appActions.handleSetTask(incoming.data.createTask.id))
        }
        dispatch(appActions.setTaskAddingStatus(OK))
      })
      .catch((err) => {
        console.error(err)
        dispatch(appActions.setTaskAddingStatus(OK))
      })
  } else {
    if (taskState.projectID === getState().app.selectedProject) {
      dispatch(createTask(taskState))
      if (taskState.projectID === getState().app.selectedProject) {
        dispatch(appActions.handleSetTask(null))
      }
      dispatch(appActions.handleSetTask(taskState.id))
    }
    const localProjects = JSON.parse(window.localStorage.getItem("projects"))
    const tasksArray = localProjects[taskState.projectID].tasks
    let tasksList = {}
    for (const task of tasksArray) {
      tasksList[task.id] = task
    }
    tasksList = injectItemOrder(
      tasksList,
      taskState,
      taskState.prevTask,
      taskState.nextTask,
      "prevTask",
      "nextTask"
    )
    tasksList = {...tasksList, [taskState.id]: taskState}
    localProjects[taskState.projectID].tasks = Object.values(tasksList)
    return window.localStorage.setItem("projects", JSON.stringify(localProjects))
  }
}

export const handleUpdateTask = (update) => (dispatch, getState) => {
  const { user, tasks, app } = getState()
  const prevTaskState = {...tasks[update.id]}
  const prevCommands = app.commands
  if (update.task) {
    const tokens = /^(.*?)(\/.*||)$/m.exec(update.task)
    update.task = tokens[1];
    dispatch(appActions.handleSetCommand(tokens[2]))
  }
  const updateWithID = {id: prevTaskState.id, ...update };
  if (user.state === AuthState.SignedIn) {
    if (tasks[prevTaskState.id]) {
      dispatch(updateTask(updateWithID))
    }
    return API.graphql(graphqlOperation(mutations.updateTask, { input: updateWithID }))
      .catch(() => {
        if (tasks[prevTaskState.id]) {
          dispatch(appActions.handleSetCommand(prevCommands))
          return dispatch(updateTask(prevTaskState))
        }
      })
  } else {
    if (tasks[prevTaskState.id]) {
      dispatch(updateTask(updateWithID));
    }
    const localProjects = JSON.parse(window.localStorage.getItem("projects"))
    const tasksArray = localProjects[prevTaskState.projectID].tasks
    let tasksList = {}
    for (const task of tasksArray) {
      tasksList[task.id] = task
    }
    if (update.prevTask !== undefined && update.nextTask !== undefined) {
      tasksList = removeItemOrder(
        tasksList,
        tasksList[update.id],
        "prevTask",
        "nextTask"
      )
      tasksList = injectItemOrder(
        tasksList,
        tasksList[update.id],
        update.prevTask,
        update.nextTask,
        "prevTask",
        "nextTask"
      )
    }
    tasksList = {
      ...tasksList,
      [update.id]: {
        ...tasksList[update.id],
        ...update
    }}
    localProjects[prevTaskState.projectID].tasks = Object.values(tasksList)
    return window.localStorage.setItem("projects", JSON.stringify(localProjects))
  }
}

export const handleRemoveTask = (taskState) => (dispatch, getState) => {
  const { user, tasks, app } = getState()
  if (app.selectedTask === taskState.id) {
    dispatch(appActions.handleSetTask(null))
  }
  if (user.state === AuthState.SignedIn) {
    if (tasks[taskState.id]) {
      dispatch(removeTask(taskState.id))
    }
    return API.graphql(graphqlOperation(mutations.deleteTaskAndComments, { taskId: taskState.id }))
      .catch(() => {
        if (tasks[taskState.id]) {
          dispatch(createTask(taskState))
        }
      })
  } else {
    if (tasks[taskState.id]) {
      dispatch(removeTask(taskState.id))
    }
    const localProjects = JSON.parse(window.localStorage.getItem("projects"))
    const tasksArray = localProjects[taskState.projectID].tasks
    let tasksList = {}
    for (const task of tasksArray) {
      tasksList[task.id] = task
    }
    tasksList = removeItemOrder(
      tasksList,
      tasksList[taskState.id],
      "prevTask",
      "nextTask"
    )
    delete tasksList[taskState.id]
    localProjects[taskState.projectID].tasks = Object.values(tasksList)
    return window.localStorage.setItem("projects", JSON.stringify(localProjects))
  }
}

export const handleFetchTasks = (projectID) => async (dispatch, getState) => {
  const { user } = getState()
  dispatch(appActions.handleSetTask(null))
  if (user.state === AuthState.SignedIn) {
    try {
      const res = await API.graphql(graphqlOperation(listTasksForProject, { projectID }))
      const items = res.data.listTasksForProject.items
      for (const item of items) {
        if (item.assignee !== NOT_ASSIGNED) {
          dispatch(usersActions.handleAddUser(item.assignee))
        }
      }
      dispatch(fetchTasks(items))
      return getState().tasks
    } catch (err) {
      console.error(err)
    }
  } else {
    const localProjects = JSON.parse(window.localStorage.getItem("projects"))
    if (localProjects?.[projectID].tasks) {
      dispatch(fetchTasks(localProjects[projectID].tasks))
    } else {
      dispatch(fetchTasks([]))
    }
    return getState().tasks
  }
}