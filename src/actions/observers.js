import { API, graphqlOperation } from "aws-amplify";
import * as projectsActions from "./projects"
import * as tasksActions from "./tasks"
import * as commentsActions from "./comments"
import * as appActions from "./app"
import * as userActions from "./user"
import * as usersActions from "./users"
import * as subscriptions from "../graphql/subscriptions"
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

export const handleSetUserObservers = () => async (dispatch, getState) => {
  const { user } = getState()
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
  const { user } = getState()
  const observers = [];
  const data = {
    owner: user.data.username
  }
  observers.push(await API.graphql(graphqlOperation(subscriptions.onCreateOwnedProject, data)).subscribe({
    next: e => {
      const { projects } = getState()
      const ownedProjects = filterObj(projects, x => x.isOwned)
      const incoming = e.value.data.onCreateOwnedProject
      if (!Object.keys(ownedProjects).includes(incoming.id)) {
        dispatch(projectsActions.createProject(incoming, "owned"))
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
      const { projects, mutations } = getState()
      const ownedProjects = filterObj(projects, x => x.isOwned)
      const incoming = e.value.data.onUpdateOwnedProject
      if (!mutations.includes(incoming.mutationID)) {
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
      const removedItemID = e.value.data.onDeleteOwnedProject.id;
      if (Object.keys(ownedProjects).includes(removedItemID)) {
        if (app.selectedProject === removedItemID) {
          dispatch(appActions.handleSetTask(null))
        }
        dispatch(projectsActions.removeProject(removedItemID))
      }
    },
    error: error => console.warn(error)
  }))
  return dispatch(setOwnedProjectsObservers(observers))
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
  const { projects, observers } = getState()
  if (!projects[projectID]?.isAssigned && !observers.projects.others[projectID]) {
    const observers = [];
    const data = { id: projectID }
    observers.push(await API.graphql(graphqlOperation(subscriptions.onUpdateProject, data)).subscribe({
      next: e => {
        const { projects, mutations } = getState()
        const incoming = e.value.data.onUpdateProject
        if (!mutations.includes(incoming.mutationID)) {
          if (projects[incoming.id]) {
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
    observers.push(await API.graphql(graphqlOperation(subscriptions.onDeleteProject, data)).subscribe({
      next: e => {
        const { app, projects } = getState()
        const removedItemID = e.value.data.onDeleteProject.id;
        if (projects[removedItemID]) {
          dispatch(handleClearProjectObservers(removedItemID))
          if (app.selectedProject === removedItemID) {
            dispatch(appActions.handleSetTask(null))
          }
          dispatch(projectsActions.removeProject(removedItemID))
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
  const { app } = getState()
  if (app.selectedProject === projectID) {
    const observers = [];
    observers.push(await API.graphql(graphqlOperation(subscriptions.onCreateTaskByProjectId, { projectID })).subscribe({
      next: async (e) => {
        const { tasks } = getState()
        const incoming = e.value.data.onCreateTaskByProjectID
        if (!Object.keys(tasks).includes(incoming.id)) {
          const usersToBeFetched = [...new Set([
            ...incoming.assignees.filter(x => /^user:.*$/.test(x)).map(x => x.replace(/^user:/, "")),
            ...incoming.watchers
          ])]
          await dispatch(usersActions.handleAddUsers(usersToBeFetched))
          dispatch(tasksActions.createTask(incoming))
        }
      },
      error: error => console.warn(error)
    }))
    observers.push(await API.graphql(graphqlOperation(subscriptions.onUpdateTaskByProjectId, { projectID })).subscribe({
      next: async (e) => {
        const { tasks, mutations } = getState()
        const incoming = e.value.data.onUpdateTaskByProjectID
        if (!mutations.includes(incoming.mutationID)) {
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
        const removedItemID = e.value.data.onDeleteTaskByProjectID.id;
        if (Object.keys(tasks).includes(removedItemID)) {
          if (app.selectedTask === removedItemID) {
            dispatch(appActions.handleSetTask(null))
          }
          dispatch(tasksActions.removeTask(removedItemID))
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
  const { app } = getState()
    if (app.selectedTask === taskID) {
    const observers = [];
    observers.push(await API.graphql(graphqlOperation(subscriptions.onCreateCommentByTaskId, { taskID })).subscribe({
      next: async (e) => {
        const { comments } = getState()
        const incoming = e.value.data.onCreateCommentByTaskID
        if (!Object.keys(comments).includes(incoming.id)) {
          await dispatch(usersActions.handleAddUsers([incoming.owner]))
          dispatch(commentsActions.createComment(incoming))
        }
      },
      error: error => console.warn(error)
    }))
    observers.push(await API.graphql(graphqlOperation(subscriptions.onUpdateCommentByTaskId, { taskID })).subscribe({
      next: e => {
        const { comments, mutations } = getState()
        const incoming = e.value.data.onUpdateCommentByTaskID
        if (!mutations.includes(incoming.mutationID)) {
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
        const removedItemID = e.value.data.onDeleteCommentByTaskID.id;
        if (Object.keys(comments).includes(removedItemID)) {
          dispatch(commentsActions.removeComment(removedItemID))
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