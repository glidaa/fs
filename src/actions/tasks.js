import { API, graphqlOperation } from "aws-amplify";
import { AuthState } from '@aws-amplify/ui-components';
import { listTasksForProject } from "../graphql/queries"
import injectItemOrder from "../utils/injectItemOrder"
import removeItemOrder from "../utils/removeItemOrder"
import * as appActions from "./app"
import * as projectsActions from "./projects"
import * as usersActions from "./users"
import * as mutationsActions from "./mutations"
import * as mutations from "../graphql/mutations"
import { OK, PENDING } from "../constants";
import prepareTaskToBeSent from "../utils/prepareTaskToBeSent";
import generateMutationID from "../utils/generateMutationID";

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
      dispatch(projectsActions.handleUpdateTaskCount(taskState.projectID, null, taskState.status))
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
    dispatch(appActions.setCommand(tokens[2]))
  }
  const updateWithID = {id: prevTaskState.id, ...update };
  if (user.state === AuthState.SignedIn) {
    const mutationID = generateMutationID(user.data.username)
    dispatch(mutationsActions.addMutation(mutationID))
    if (tasks[prevTaskState.id]) {
      dispatch(updateTask(updateWithID))
    }
    return API.graphql(graphqlOperation(mutations.updateTask, { input: { ...updateWithID, mutationID } }))
      .catch((err) => {
        console.error(err)
        if (tasks[prevTaskState.id]) {
          dispatch(appActions.setCommand(prevCommands))
          return dispatch(updateTask(prevTaskState))
        }
      })
  } else {
    if (tasks[prevTaskState.id]) {
      dispatch(updateTask(updateWithID));
      if (update.status && prevTaskState.status !== update.status) {
        dispatch(projectsActions.handleUpdateTaskCount(prevTaskState.projectID, prevTaskState.status, update.status))
      }
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
      .catch((err) => {
        console.error(err)
        if (tasks[taskState.id]) {
          dispatch(createTask(taskState))
        }
      })
  } else {
    if (tasks[taskState.id]) {
      dispatch(removeTask(taskState.id))
      dispatch(projectsActions.handleUpdateTaskCount(taskState.projectID, taskState.status, null))
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

export const handleAssignTask = (taskID, username) => async (dispatch, getState) => {
  const {
    tasks,
    user
  } = getState()
  const prevAssignees = [...tasks[taskID].assignees]
  if (user.state === AuthState.SignedIn || /^anonymous:.*$/.test(username)) {
    dispatch(updateTask({
      id: taskID,
      assignees: [...new Set([...prevAssignees, username])]
    }))
  }
  if (user.state === AuthState.SignedIn) {
    try {
      await API.graphql(graphqlOperation(mutations.assignTask, {
        taskID: taskID,
        assignee: username
      }))
    } catch {
      dispatch(updateTask({
        id: taskID,
        assignees: prevAssignees
      }))
    }
  }
}

export const handleAddWatcher = (taskID, username) => async (dispatch, getState) => {
  const {
    tasks,
    user
  } = getState()
  if (user.state === AuthState.SignedIn) {
    const prevWatchers = [...tasks[taskID].watchers]
    dispatch(updateTask({
      id: taskID,
      watchers: [...new Set([...prevWatchers, username])]
    }))
    try {
      await API.graphql(graphqlOperation(mutations.addWatcher, {
        taskID: taskID,
        watcher: username
      }))
    } catch {
      dispatch(updateTask({
        id: taskID,
        watchers: prevWatchers
      }))
    }
  }
}

export const handleUnassignTask = (taskID, username) => async (dispatch, getState) => {
  const {
    tasks,
    user
  } = getState()
  const prevAssignees = [...tasks[taskID].assignees]
  dispatch(updateTask({
    id: taskID,
    assignees: [...prevAssignees].filter(x => x !== username)
  }))
  if (user.state === AuthState.SignedIn) {
    try {
      await API.graphql(graphqlOperation(mutations.unassignTask, {
        taskID: taskID,
        assignee: username
      }))
    } catch {
      dispatch(updateTask({
        id: taskID,
        assignees: prevAssignees
      }))
    }
  }
}

export const handleRemoveWatcher= (taskID, username) => async (dispatch, getState) => {
  const {
    tasks,
    user
  } = getState()
  if (user.state === AuthState.SignedIn) {
    const prevWatchers = [...tasks[taskID].watchers]
    dispatch(updateTask({
      id: taskID,
      watchers: [...prevWatchers].filter(x => x !== username)
    }))
    try {
      await API.graphql(graphqlOperation(mutations.unassignTask, {
        taskID: taskID,
        watcher: username
      }))
    } catch {
      dispatch(updateTask({
        id: taskID,
        watchers: prevWatchers
      }))
    }
  }
}

export const handleFetchTasks = (projectID) => async (dispatch, getState) => {
  const { user } = getState()
  dispatch(appActions.handleSetTask(null))
  if (user.state === AuthState.SignedIn) {
    try {
      const res = await API.graphql(graphqlOperation(listTasksForProject, { projectID }))
      const items = res.data.listTasksForProject.items
      let usersToBeFetched = []
      for (const item of items) {
        usersToBeFetched = [...new Set([
          ...usersToBeFetched,
          ...item.assignees.filter(x => /^user:.*$/.test(x)).map(x => x.replace(/^user:/, "")),
          ...item.watchers
        ])]
      }
      await dispatch(usersActions.handleAddUsers(usersToBeFetched))
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