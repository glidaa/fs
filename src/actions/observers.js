import { API, graphqlOperation } from "@aws-amplify/api";
import * as projectsActions from "./projects"
import * as tasksActions from "./tasks"
import * as commentsActions from "./comments"
import * as notificationsActions from "./notifications"
import * as appActions from "./app"
import * as userActions from "./user"
import * as usersActions from "./users"
import * as subscriptions from "../graphql/subscriptions"
import * as mutationID from "../utils/mutationID"
import filterObj from "../utils/filterObj";
import updateAssignedTasks from "../pushedUpdates/updateAssignedTasks";
import updateWatchedTasks from "../pushedUpdates/updateWatchedTasks";

export const SET_USER_OBSERVERS = "SET_USER_OBSERVERS";
export const CLEAR_USER_OBSERVERS = "CLEAR_USER_OBSERVERS";
export const SET_OWNED_PROJECTS_OBSERVERS = "SET_OWNED_PROJECTS_OBSERVERS";
export const CLEAR_OWNED_PROJECTS_OBSERVERS = "CLEAR_OWNED_PROJECTS_OBSERVERS";
export const SET_PROJECT_OBSERVERS = "SET_PROJECT_OBSERVERS";
export const CLEAR_PROJECT_OBSERVERS = "CLEAR_PROJECT_OBSERVERS";
export const SET_TASKS_OBSERVERS = "SET_TASKS_OBSERVERS";
export const CLEAR_TASKS_OBSERVERS = "CLEAR_TASKS_OBSERVERS";
export const SET_COMMENTS_OBSERVERS = "SET_COMMENTS_OBSERVERS";
export const CLEAR_COMMENTS_OBSERVERS = "CLEAR_COMMENTS_OBSERVERS";
export const SET_NOTIFICATIONS_OBSERVERS = "SET_NOTIFICATIONS_OBSERVERS";
export const CLEAR_NOTIFICATIONS_OBSERVERS = "CLEAR_NOTIFICATIONS_OBSERVERS";

const setUserObservers = (observers) => ({
  type: SET_USER_OBSERVERS,
  observers
});

const clearUserObservers = () => ({
  type: CLEAR_USER_OBSERVERS
});

const setOwnedProjectsObservers = (observers) => ({
  type: SET_OWNED_PROJECTS_OBSERVERS,
  observers
});

const clearOwnedProjectsObservers = () => ({
  type: CLEAR_OWNED_PROJECTS_OBSERVERS
});

const setProjectObservers = (id, observers) => ({
  type: SET_OWNED_PROJECTS_OBSERVERS,
  observers,
  id
});

const clearProjectObservers = (id) => ({
  type: CLEAR_OWNED_PROJECTS_OBSERVERS,
  id
});

const setTasksObservers = (observers) => ({
  type: SET_TASKS_OBSERVERS,
  observers
});

const clearTasksObservers = () => ({
  type: CLEAR_TASKS_OBSERVERS
});

const setCommentsObservers = (observers) => ({
  type: SET_COMMENTS_OBSERVERS,
  observers
});

const clearCommentsObservers = () => ({
  type: CLEAR_COMMENTS_OBSERVERS
});

const setNotificationsObservers = (observers) => ({
  type: SET_NOTIFICATIONS_OBSERVERS,
  observers
});

const clearNotificationsObservers = () => ({
  type: CLEAR_NOTIFICATIONS_OBSERVERS
});

export const handleSetNotificationsObservers = () => async (dispatch, getState) => {
  const { user, app: { isOffline } } = getState()
  if (!isOffline) {
    const observers = [];
    const data = {
      owner: user.data.username
    }
    observers.push(await API.graphql(graphqlOperation(subscriptions.onPushNotification, data)).subscribe({
      next: async e => {
        const { notifications } = getState()
        const incoming = e.value.data.onPushNotification
        if (!notifications.stored.filter(x => x.id === incoming.id).length) {
          await dispatch(usersActions.handleAddUsers([incoming.sender]))
          dispatch(notificationsActions.add(incoming))
          dispatch(notificationsActions.push(incoming))
        }
      },
      error: error => console.warn(error)
    }))
    observers.push(await API.graphql(graphqlOperation(subscriptions.onDismissNotification, data)).subscribe({
      next: e => {
        const { notifications } = getState()
        const incoming = e.value.data.onDismissNotification
        if (notifications.stored.filter(x => x.id === incoming.id).length) {
          dispatch(notificationsActions.dismiss(incoming.id))
          dispatch(notificationsActions.remove(incoming.id))
        }
      },
      error: error => console.warn(error)
    }))
    return dispatch(setNotificationsObservers(observers))
  }
}

export const handleClearNotificationsObservers = () => (dispatch, getState) => {
  const { observers } = getState()
  if (observers.notifications) {
    for (const observer of observers.notifications) {
      observer.unsubscribe()
    }
  }
  return dispatch(clearNotificationsObservers())
}

export const handleSetUserObservers = () => async (dispatch, getState) => {
  const { user, app: { isOffline } } = getState()
  if (!isOffline) {
    const observers = [];
    const data = {
      username: user.data.username
    }
    observers.push(await API.graphql(graphqlOperation(subscriptions.onPushUserUpdate, data)).subscribe({
      next: e => {
        const incoming = e.value.data.onPushUserUpdate
        dispatch(userActions.handleSetData(incoming))
        updateAssignedTasks(dispatch, getState, incoming)
        updateWatchedTasks(dispatch, getState, incoming)
      },
      error: error => console.warn(error)
    }))
    return dispatch(setUserObservers(observers))
  }
}

export const handleClearUserObservers = () => (dispatch, getState) => {
  const { observers } = getState()
  if (observers.user) {
    for (const observer of observers.user) {
      observer.unsubscribe()
    }
  }
  return dispatch(clearUserObservers())
}

export const handleSetOwnedProjectsObservers = () => async (dispatch, getState) => {
  const { user, app: { isOffline } } = getState()
  if (!isOffline) {
    const observers = [];
    const data = {
      owner: user.data.username
    }
    observers.push(await API.graphql(graphqlOperation(subscriptions.onCreateOwnedProject, data)).subscribe({
      next: e => {
        const { projects } = getState()
        const ownedProjects = filterObj(projects, x => x.isOwned)
        const incoming = e.value.data.onCreateOwnedProject
        if (!mutationID.isLocal(incoming.mutationID)) {
          if (!Object.keys(ownedProjects).includes(incoming.id)) {
            dispatch(projectsActions.createProject(incoming, "owned"))
          }
        }
      },
      error: error => console.warn(error)
    }))
    observers.push(await API.graphql(graphqlOperation(subscriptions.onImportOwnedProjects, data)).subscribe({
      next: e => {
        const { projects } = getState()
        const ownedProjects = filterObj(projects, x => x.isOwned)
        const incoming = e.value.data.onImportOwnedProjects.items
        for (const project of incoming) {
          if (!Object.keys(ownedProjects).includes(project.id)) {
            dispatch(projectsActions.createProject(project))
          }
        }
      },
      error: error => console.warn(error)
    }))
    observers.push(await API.graphql(graphqlOperation(subscriptions.onUpdateOwnedProject, data)).subscribe({
      next: e => {
        const { projects } = getState()
        const ownedProjects = filterObj(projects, x => x.isOwned)
        const incoming = e.value.data.onUpdateOwnedProject
        if (!mutationID.isLocal(incoming.mutationID)) {
          if (Object.keys(ownedProjects).includes(incoming.id)) {
            const lastMutationDate = projects[incoming.id].mutatedAt || null
            const mutationDate = parseInt(/.?_(\d+)_.*/.exec(incoming.mutationID)?.[1], 10)
            if (!mutationDate || (mutationDate && lastMutationDate < mutationDate)) {
              dispatch(projectsActions.updateProject({
                ...incoming,
                mutatedAt: mutationDate
              }))
            }
          }
        }
      },
      error: error => console.warn(error)
    }))
    observers.push(await API.graphql(graphqlOperation(subscriptions.onDeleteOwnedProject, data)).subscribe({
      next: e => {
        const { app, projects } = getState()
        const ownedProjects = filterObj(projects, x => x.isOwned)
        const incoming = e.value.data.onDeleteOwnedProject;
        if (!mutationID.isLocal(incoming.mutationID)) {
          if (Object.keys(ownedProjects).includes(incoming.id)) {
            if (app.selectedProject === incoming.id) {
              dispatch(appActions.handleSetTask(null))
            }
            dispatch(projectsActions.removeProject(incoming.id))
          }
        }
      },
      error: error => console.warn(error)
    }))
    return dispatch(setOwnedProjectsObservers(observers))
  }
}

export const handleClearOwnedProjectsObservers = () => (dispatch, getState) => {
  const { observers } = getState()
  if (observers.projects.owned) {
    for (const observer of observers.projects.owned) {
      observer.unsubscribe()
    }
  }
  return dispatch(clearOwnedProjectsObservers())
}

export const handleSetProjectObservers = (projectID) => async (dispatch, getState) => {
  const { projects, observers, app: { isOffline } } = getState()
  if (!isOffline && !projects[projectID]?.isAssigned && !observers.projects.others[projectID]) {
    const observers = [];
    const data = { id: projectID }
    observers.push(await API.graphql(graphqlOperation(subscriptions.onUpdateProject, data)).subscribe({
      next: e => {
        const { projects, app } = getState()
        const incoming = e.value.data.onUpdateProject
        if (projects[incoming.id]) {
          if (!mutationID.isLocal(incoming.mutationID)) {
            const lastMutationDate = projects[incoming.id].mutatedAt || null
            const mutationDate = parseInt(/.?_(\d+)_.*/.exec(incoming.mutationID)?.[1], 10)
            if (!mutationDate || (mutationDate && lastMutationDate < mutationDate)) {
              const prevPermalink = projects[incoming.id].permalink
              dispatch(projectsActions.updateProject({
                ...incoming,
                mutatedAt: mutationDate
              }))
              if (app.selectedProject === incoming.id && incoming.permalink !== prevPermalink) {
                app?.navigate("/" + incoming.permalink, { replace: true })
              }
            }
          }
        }
      },
      error: error => console.warn(error)
    }))
    observers.push(await API.graphql(graphqlOperation(subscriptions.onDeleteProject, data)).subscribe({
      next: e => {
        const { app, projects } = getState()
        const incoming = e.value.data.onDeleteProject;
        if (projects[incoming.id]) {
          if (!mutationID.isLocal(incoming.mutationID)) {
            dispatch(handleClearProjectObservers(incoming.id))
            if (app.selectedProject === incoming.id) {
              dispatch(appActions.handleSetTask(null))
            }
            dispatch(projectsActions.removeProject(incoming.id))
          }
        }
      },
      error: error => console.warn(error)
    }))
    return dispatch(setProjectObservers(projectID, observers))
  }
}

export const handleClearProjectObservers = (projectID) => (dispatch, getState) => {
  const { observers } = getState()
  if (observers.projects.others[projectID]) {
    for (const observer of observers.projects.others[projectID]) {
      observer.unsubscribe()
    }
  }
  return dispatch(clearProjectObservers(projectID))
}

export const handleSetTasksObservers = (projectID) => async (dispatch, getState) => {
  const { app: { selectedProject, isOffline } } = getState()
  if (!isOffline && selectedProject === projectID) {
    const observers = [];
    observers.push(await API.graphql(graphqlOperation(subscriptions.onCreateTaskByProjectId, { projectID })).subscribe({
      next: async (e) => {
        const { tasks } = getState()
        const incoming = e.value.data.onCreateTaskByProjectID
        if (!mutationID.isLocal(incoming.mutationID)) {
          if (!Object.keys(tasks).includes(incoming.id)) {
            const usersToBeFetched = [...new Set([
              ...incoming.assignees.filter(x => /^user:.*$/.test(x)).map(x => x.replace(/^user:/, "")),
              ...incoming.watchers
            ])]
            await dispatch(usersActions.handleAddUsers(usersToBeFetched))
            dispatch(tasksActions.createTask(incoming))
          }
        }
      },
      error: error => console.warn(error)
    }))
    observers.push(await API.graphql(graphqlOperation(subscriptions.onUpdateTaskByProjectId, { projectID })).subscribe({
      next: async (e) => {
        const { tasks } = getState()
        const incoming = e.value.data.onUpdateTaskByProjectID
        if (!mutationID.isLocal(incoming.mutationID)) {
          if (Object.keys(tasks).includes(incoming.id)) {
            const lastMutationDate = tasks[incoming.id].mutatedAt || null
            const mutationDate = parseInt(/.?_(\d+)_.*/.exec(incoming.mutationID)?.[1], 10)
            if (!mutationDate || (mutationDate && lastMutationDate < mutationDate)) {
              const usersToBeFetched = [...new Set([
                ...(incoming.assignees?.filter(x => /^user:.*$/.test(x))?.map(x => x.replace(/^user:/, "")) || []),
                ...(incoming.watchers || [])
              ])]
              await dispatch(usersActions.handleAddUsers(usersToBeFetched))
              dispatch(tasksActions.updateTask({
                ...incoming,
                mutatedAt: mutationDate
              }))
            }
          }
        }
      },
      error: error => console.warn(error)
    }))
    observers.push(await API.graphql(graphqlOperation(subscriptions.onDeleteTaskByProjectId, { projectID })).subscribe({
      next: e => {
        const { tasks, app } = getState()
        const incoming = e.value.data.onDeleteTaskByProjectID;
        if (!mutationID.isLocal(incoming.mutationID)) {
          if (Object.keys(tasks).includes(incoming.id)) {
            if (app.selectedTask === incoming.id) {
              dispatch(appActions.handleSetTask(null))
            }
            dispatch(tasksActions.removeTask(incoming.id))
          }
        }
      },
      error: error => console.warn(error)
    }))
    return dispatch(setTasksObservers(observers))
  }
}

export const handleClearTasksObservers = () => (dispatch, getState) => {
  const { observers } = getState()
  if (observers.tasks) {
    for (const observer of observers.tasks) {
      observer.unsubscribe()
    }
  }
  return dispatch(clearTasksObservers())
}

export const handleSetCommentsObservers = (taskID) => async (dispatch, getState) => {
  const { app: { selectedTask, isOffline } } = getState()
    if (!isOffline && selectedTask === taskID) {
    const observers = [];
    observers.push(await API.graphql(graphqlOperation(subscriptions.onCreateCommentByTaskId, { taskID })).subscribe({
      next: async (e) => {
        const { comments } = getState()
        const incoming = e.value.data.onCreateCommentByTaskID
        if (!mutationID.isLocal(incoming.mutationID)) {
          if (!Object.keys(comments).includes(incoming.id)) {
            await dispatch(usersActions.handleAddUsers([incoming.owner]))
            dispatch(commentsActions.createComment(incoming))
          }
        }
      },
      error: error => console.warn(error)
    }))
    observers.push(await API.graphql(graphqlOperation(subscriptions.onUpdateCommentByTaskId, { taskID })).subscribe({
      next: e => {
        const { comments } = getState()
        const incoming = e.value.data.onUpdateCommentByTaskID
        if (!mutationID.isLocal(incoming.mutationID)) {
          if (Object.keys(comments).includes(incoming.id)) {
            const lastMutationDate = comments[incoming.id].mutatedAt || null
            const mutationDate = parseInt(/.?_(\d+)_.*/.exec(incoming.mutationID)?.[1], 10)
            if (!mutationDate || (mutationDate && lastMutationDate < mutationDate)) {
              dispatch(commentsActions.updateComment({
                ...incoming,
                mutatedAt: mutationDate
              }))
            }
          }
        }
      },
      error: error => console.warn(error)
    }))
    observers.push(await API.graphql(graphqlOperation(subscriptions.onDeleteCommentByTaskId, { taskID })).subscribe({
      next: e => {
        const { comments } = getState()
        const incoming = e.value.data.onDeleteCommentByTaskID;
        if (!mutationID.isLocal(incoming.mutationID)) {
          if (Object.keys(comments).includes(incoming.id)) {
            dispatch(commentsActions.removeComment(incoming.id))
          }
        }
      },
      error: error => console.warn(error)
    }))
    return dispatch(setCommentsObservers(observers))
  }
}

export const handleClearCommentsObservers = () => (dispatch, getState) => {
  const { observers } = getState()
  if (observers.comments) {
    for (const observer of observers.comments) {
      observer.unsubscribe()
    }
  }
  return dispatch(clearCommentsObservers())
}