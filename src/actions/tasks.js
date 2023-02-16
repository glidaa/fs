import { AuthState, ThingStatus } from '../constants';
import { listTasksForProject } from "../graphql/queries"
import * as appActions from "./app"
import * as statusActions from "./status"
import * as usersActions from "./users"
import * as commentsActions from "./comments"
import * as attachmentsActions from "./attachments"
import * as historyActions from "./history"
import * as cacheController from "../controllers/cache"
import prepareTaskToBeSent from "../utils/prepareTaskToBeSent";
import API from '../amplify/API';
import PubSub from '../amplify/PubSub';

export const CREATE_TASK = "CREATE_TASK";
export const UPDATE_TASK = "UPDATE_TASK";
export const REMOVE_TASK = "REMOVE_TASK";
export const EMPTY_TASKS = "EMPTY_TASKS";
export const FETCH_TASKS = "FETCH_TASKS";
export const FETCH_CACHED_TASKS = "FETCH_CACHED_TASKS";

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

const fetchTasks = (tasks, projectId) => ({
  type: FETCH_TASKS,
  tasks,
  projectId
});

const fetchCachedTasks = (tasks) => ({
  type: FETCH_CACHED_TASKS,
  tasks
});

export const handleCreateTask = (taskState) => (dispatch, getState) => {
  const { app, user, projects } = getState()
  if (user.state === AuthState.SignedIn) {
    const dataToSend = prepareTaskToBeSent(taskState, user.data.username)
    if (taskState.projectId === getState().app.selectedProject) {
      dispatch(createTask({
        watchers: [],
        permalink: projects[app.selectedProject].totalTasks + 1,
        owner: user.data.username,
        isVirtual: true,
        ...taskState
      }))
      dispatch(appActions.handleSetTask(taskState.id))
    }
    API.mutate({
      type: "createTask",
      variables: dataToSend,
      success: (incoming) => {
        dispatch(updateTask({
          id: incoming.data.createTask.id,
          action: "update",
          field: "permalink",
          value: incoming.data.createTask.permalink,
        }))
        dispatch(updateTask({
          id: incoming.data.createTask.id,
          action: "update",
          field: "isVirtual",
          value: false
        }))
        if (getState().app.selectedTask === taskState.id) {
          dispatch(attachmentsActions.handleFetchAttachments(taskState.id))
          dispatch(historyActions.handleFetchHistory(taskState.id))
          dispatch(commentsActions.handleFetchComments(taskState.id))
          PubSub.subscribeTopic("comments", taskState.id)
        }
      },
      error: () => {
        if (getState().app.selectedTask === taskState.id) {
          dispatch(appActions.handleSetTask(null))
        }
        dispatch(removeTask(taskState.id))
      }
    })
  } else {
    if (taskState.projectId === getState().app.selectedProject) {
      dispatch(createTask(taskState))
      dispatch(appActions.handleSetTask(taskState.id))
    }
  }
}

export const handleUpdateTask = (update) => (dispatch, getState) => {
  const { user, tasks } = getState()
  if (
    (update.action === "update" && tasks[update.id][update.field] === update.value) ||
    (update.action === "append" && tasks[update.id][update.field].includes(update.value)) ||
    (update.action === "remove" && !tasks[update.id][update.field].includes(update.value))
  ) { return; }
  const snapshot = {
    id: update.id,
    action:
      update.action === "append"
        ? "remove"
        : update.action === "remove"
        ? "append"
        : "update",
    field: update.field,
    value:
      update.action === "append" || update.action === "remove"
        ? update.value
        : tasks[update.id][update.field],
  };
  if (tasks[update.id]) {
    dispatch(updateTask(update))
  }
  if (user.state === AuthState.SignedIn) {
    API.mutate({
      type: "updateTask" + update.field[0].toUpperCase() + update.field.slice(1),
      variables: {
        id: update.id,
        [update.field]: update.value
      },
      success: null,
      error: () => {
        if (getState().tasks[update.id]) {
          dispatch(updateTask(snapshot))
        }
      }
    })
  }
}

export const handleRemoveTask = (taskState, prevTask = null) => (dispatch, getState) => {
  const { user, tasks, app } = getState()
  if (app.selectedTask === taskState.id) {
    dispatch(appActions.handleSetTask(prevTask))
  }
  if (tasks[taskState.id]) {
    dispatch(removeTask(taskState.id))
  }
  if (user.state === AuthState.SignedIn) {
    API.mutate({
      type: "deleteTaskAndComments",
      variables: { id: taskState.id },
      success: null,
      error: () => {
        if (getState().app.selectedProject === taskState.projectId) {
          dispatch(createTask(taskState))
        }
      }
    })
  }
}

export const handleAddAssignee = (taskId, username) => async (dispatch, getState) => {
  const { user } = getState()
  if (user.state === AuthState.SignedIn) {
    dispatch(updateTask({
      id: taskId,
      action: "append",
      field: "assignees",
      value: username
    }))
    API.mutate({
      type: "addAssignee",
      variables: { id: taskId, assignee: username },
      success: null,
      error: () => {
        if (getState().tasks[taskId]) {
          dispatch(updateTask({
            id: taskId,
            action: "remove",
            field: "assignees",
            value: username
          }))
        }
      }
    })
  }
}

export const handleRemoveAssignee = (taskId, username) => async (dispatch, getState) => {
  const { user } = getState()
  dispatch(updateTask({
    id: taskId,
    action: "remove",
    field: "assignees",
    value: username
  }))
  if (user.state === AuthState.SignedIn) {
    API.mutate({
      type: "removeAssignee",
      variables: { id: taskId, assignee: username },
      success: null,
      error: () => {
        if (getState().tasks[taskId]) {
          dispatch(updateTask({
            id: taskId,
            action: "append",
            field: "assignees",
            value: username
          }))
        }
      }
    })
  }
}

export const handleAddAnonymousAssignee = (taskId, username) => async (dispatch, getState) => {
  const { user } = getState()
  dispatch(updateTask({
    id: taskId,
    action: "append",
    field: "anonymousAssignees",
    value: username
  }))
  if (user.state === AuthState.SignedIn) {
    API.mutate({
      type: "addAnonymousAssignee",
      variables: { id: taskId, assignee: username },
      success: null,
      error: () => {
        if (getState().tasks[taskId]) {
          dispatch(updateTask({
            id: taskId,
            action: "remove",
            field: "anonymousAssignees",
            value: username
          }))
        }
      }
    })
  }
}

export const handleRemoveAnonymousAssignee = (taskId, username) => async (dispatch, getState) => {
  const { user } = getState()
  dispatch(updateTask({
    id: taskId,
    action: "remove",
    field: "anonymousAssignees",
    value: username
  }))
  if (user.state === AuthState.SignedIn) {
    API.mutate({
      type: "removeAnonymousAssignee",
      variables: { id: taskId, assignee: username },
      success: null,
      error: () => {
        if (getState().tasks[taskId]) {
          dispatch(updateTask({
            id: taskId,
            action: "append",
            field: "anonymousAssignees",
            value: username
          }))
        }
      }
    })
  }
}

export const handleAddInvitedAssignee = (taskId, username) => async (dispatch, getState) => {
  const { user } = getState()
  dispatch(updateTask({
    id: taskId,
    action: "append",
    field: "invitedAssignees",
    value: username
  }))
  if (user.state === AuthState.SignedIn) {
    API.mutate({
      type: "addInvitedAssignee",
      variables: { id: taskId, assignee: username },
      success: null,
      error: () => {
        if (getState().tasks[taskId]) {
          dispatch(updateTask({
            id: taskId,
            action: "remove",
            field: "invitedAssignees",
            value: username
          }))
        }
      }
    })
  }
}

export const handleRemoveInvitedAssignee = (taskId, username) => async (dispatch, getState) => {
  const { user } = getState()
  dispatch(updateTask({
    id: taskId,
    action: "remove",
    field: "invitedAssignees",
    value: username
  }))
  if (user.state === AuthState.SignedIn) {
    API.mutate({
      type: "removeInvitedAssignee",
      variables: { id: taskId, assignee: username },
      success: null,
      error: () => {
        if (getState().tasks[taskId]) {
          dispatch(updateTask({
            id: taskId,
            action: "append",
            field: "invitedAssignees",
            value: username
          }))
        }
      }
    })
  }
}

export const handleAddWatcher = (taskId, username) => async (dispatch, getState) => {
  const { user } = getState()
  if (user.state === AuthState.SignedIn) {
    dispatch(updateTask({
      id: taskId,
      action: "append",
      field: "watchers",
      value: username
    }))
    await dispatch(usersActions.handleAddUsers([username]))
    API.mutate({
      type: "addWatcher",
      variables: { id: taskId, watcher: username },
      success: null,
      error: () => {
        if (getState().tasks[taskId]) {
          dispatch(updateTask({
            id: taskId,
            action: "remove",
            field: "watchers",
            value: username
          }))
        }
      }
    })
  }
}

export const handleRemoveWatcher = (taskId, username) => async (dispatch, getState) => {
  const { user } = getState()
  if (user.state === AuthState.SignedIn) {
    dispatch(updateTask({
      id: taskId,
      action: "remove",
      field: "watchers",
      value: username
    }))
    API.mutate({
      type: "removeWatcher",
      variables: { id: taskId, watcher: username },
      success: null,
      error: () => {
        if (getState().tasks[taskId]) {
          dispatch(updateTask({
            id: taskId,
            action: "append",
            field: "watchers",
            value: username
          }))
        }
      }
    })
  }
}

export const handleFetchTasks = (projectId, isInitial = false) => async (dispatch, getState) => {
  dispatch(statusActions.setTasksStatus(ThingStatus.FETCHING))
  const { user, projects } = getState()
  if (!isInitial) {
    dispatch(appActions.handleSetTask(null))
  }
  if (user.state === AuthState.SignedIn || projects[projectId].isTemp) {
    try {
      const res = await API.execute(listTasksForProject, { projectId })
      const items = res.data.listTasksForProject.items
      let usersToBeFetched = []
      for (const item of items) {
        usersToBeFetched = [...new Set([
          ...usersToBeFetched,
          ...item.assignees,
          ...item.watchers
        ])]
      }
      await dispatch(usersActions.handleAddUsers(usersToBeFetched))
      dispatch(fetchTasks(items, projectId))
      dispatch(statusActions.setTasksStatus(ThingStatus.READY))
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        dispatch(fetchCachedTasks(cacheController.getTasksByProjectId(projectId)))
        dispatch(statusActions.setTasksStatus(ThingStatus.READY))
      } else {
        dispatch(statusActions.setTasksStatus(ThingStatus.ERROR))
      }
    }
  } else {
    dispatch(fetchCachedTasks(cacheController.getTasksByProjectId(projectId)))
    dispatch(statusActions.setTasksStatus(ThingStatus.READY))
  }
  return getState().tasks
}