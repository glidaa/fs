import { API, graphqlOperation } from "aws-amplify";
import * as projectsActions from "./projects"
import * as tasksActions from "./tasks"
import * as commentsActions from "./comments"
import * as appActions from "./app"
import * as subscriptions from "../graphql/subscriptions"
import filterObj from "../utils/filterObj";

export const SET_PROJECTS_OBSERVERS = "SET_PROJECTS_OBSERVERS";
export const CLEAR_PROJECTS_OBSERVERS = "CLEAR_PROJECTS_OBSERVERS";
export const SET_TASKS_OBSERVERS = "SET_TASKS_OBSERVERS";
export const CLEAR_TASKS_OBSERVERS = "CLEAR_TASKS_OBSERVERS";
export const SET_COMMENTS_OBSERVERS = "SET_COMMENTS_OBSERVERS";
export const CLEAR_COMMENTS_OBSERVERS = "CLEAR_COMMENTS_OBSERVERS";

const setProjectsObservers = (observers) => ({
  type: SET_PROJECTS_OBSERVERS,
  observers
});

const clearProjectsObservers = () => ({
  type: CLEAR_PROJECTS_OBSERVERS
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

export const handleSetProjectsObservers = () => (dispatch, getState) => {
  const { user } = getState()
  const observers = [];
  const data = {
    owner: user.data.username
  }
  observers.push(API.graphql(graphqlOperation(subscriptions.onCreateOwnedProject, data)).subscribe({
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
  observers.push(API.graphql(graphqlOperation(subscriptions.onImportOwnedProjects, data)).subscribe({
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
  observers.push(API.graphql(graphqlOperation(subscriptions.onUpdateOwnedProject, data)).subscribe({
    next: e => {
      const { projects } = getState()
      const ownedProjects = filterObj(projects, x => x.isOwned)
      const incoming = e.value.data.onUpdateOwnedProject
      if (Object.keys(ownedProjects).includes(incoming.id)) {
        dispatch(projectsActions.updateProject(incoming))
      }
    },
    error: error => console.warn(error)
  }))
  observers.push(API.graphql(graphqlOperation(subscriptions.onDeleteOwnedProject, data)).subscribe({
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
  return dispatch(setProjectsObservers(observers))
}

export const handleClearProjectsObservers = () => (dispatch, getState) => {
  const { observers } = getState()
  if (observers.projects) {
    for (const observer of observers.projects) {
      observer.unsubscribe()
    }
  }
  return dispatch(clearProjectsObservers())
}

export const handleSetTasksObservers = (projectID) => (dispatch, getState) => {
  const { app } = getState()
  if (app.selectedProject === projectID) {
    const observers = [];
    observers.push(API.graphql(graphqlOperation(subscriptions.onCreateTaskByProjectId, { projectID })).subscribe({
      next: e => {
        const { tasks } = getState()
        const incoming = e.value.data.onCreateTaskByProjectID
        if (!Object.keys(tasks).includes(incoming.id)) {
          dispatch(tasksActions.createTask(incoming))
        }
      },
      error: error => console.warn(error)
    }))
    observers.push(API.graphql(graphqlOperation(subscriptions.onUpdateTaskByProjectId, { projectID })).subscribe({
      next: e => {
        const { tasks } = getState()
        const incoming = e.value.data.onUpdateTaskByProjectID
        if (Object.keys(tasks).includes(incoming.id)) {
          delete incoming[getState().app.lockedTaskField]
          dispatch(tasksActions.updateTask(incoming))
        }
      },
      error: error => console.warn(error)
    }))
    observers.push(API.graphql(graphqlOperation(subscriptions.onDeleteTaskByProjectId, { projectID })).subscribe({
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

export const handleSetCommentsObservers = (taskID) => (dispatch, getState) => {
  const { app } = getState()
    if (app.selectedTask === taskID) {
    const observers = [];
    observers.push(API.graphql(graphqlOperation(subscriptions.onCreateCommentByTaskId, { taskID })).subscribe({
      next: e => {
        const { comments } = getState()
        const incoming = e.value.data.onCreateCommentByTaskID
        if (!Object.keys(comments).includes(incoming.id)) {
          dispatch(commentsActions.createComment(incoming))
        }
      },
      error: error => console.warn(error)
    }))
    observers.push(API.graphql(graphqlOperation(subscriptions.onUpdateCommentByTaskId, { taskID })).subscribe({
      next: e => {
        const { comments } = getState()
        const incoming = e.value.data.onUpdateCommentByTaskID
        if (Object.keys(comments).includes(incoming.id)) {
          dispatch(commentsActions.updateComment(incoming))
        }
      },
      error: error => console.warn(error)
    }))
    observers.push(API.graphql(graphqlOperation(subscriptions.onDeleteCommentByTaskId, { taskID })).subscribe({
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