import { API, graphqlOperation } from "aws-amplify";
import * as projectsActions from "./projects"
import * as notesActions from "./notes"
import * as commentsActions from "./comments"
import * as appActions from "./app"
import * as subscriptions from "../graphql/subscriptions"

export const SET_PROJECTS_OBSERVERS = "SET_PROJECTS_OBSERVERS";
export const CLEAR_PROJECTS_OBSERVERS = "CLEAR_PROJECTS_OBSERVERS";
export const SET_NOTES_OBSERVERS = "SET_NOTES_OBSERVERS";
export const CLEAR_NOTES_OBSERVERS = "CLEAR_NOTES_OBSERVERS";
export const SET_COMMENTS_OBSERVERS = "SET_COMMENTS_OBSERVERS";
export const CLEAR_COMMENTS_OBSERVERS = "CLEAR_COMMENTS_OBSERVERS";

const setProjectsObservers = (observers) => ({
  type: SET_PROJECTS_OBSERVERS,
  observers
});

const clearProjectsObservers = () => ({
  type: CLEAR_PROJECTS_OBSERVERS
});

const setNotesObservers = (observers) => ({
  type: SET_NOTES_OBSERVERS,
  observers
});

const clearNotesObservers = () => ({
  type: CLEAR_NOTES_OBSERVERS
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
  const assigneeData = {
    assignee: user.data.username
  }
  observers.push(API.graphql(graphqlOperation(subscriptions.onAssignNote, assigneeData)).subscribe({
    next: e => {
      const { app, projects } = getState()
      const incoming = e.value.data.onAssignNote
      if (app.selectedProject === incoming.projectID) {
        dispatch(notesActions.createNote(incoming))
      }
      if (!projects.assigned[incoming.projectID]) {
        dispatch(projectsActions.handleFetchAssignedProjects())
      }
    },
    error: error => console.warn(error)
  }))
  observers.push(API.graphql(graphqlOperation(subscriptions.onDisallowNote, assigneeData)).subscribe({
    next: e => {
      const { app } = getState()
      const incoming = e.value.data.onAssignNote
      if (app.selectedProject === incoming.projectID) {
        dispatch(notesActions.removeNote(incoming))
        if (Object.keys(getState().notes).length === 0) {
          dispatch(projectsActions.removeProject(incoming.projectID, "assigned"))
        }
      }
      dispatch(projectsActions.handleFetchAssignedProjects())
    },
    error: error => console.warn(error)
  }))
  observers.push(API.graphql(graphqlOperation(subscriptions.onCreateOwnedProject, data)).subscribe({
    next: e => {
      const { projects } = getState()
      const incoming = e.value.data.onCreateOwnedProject
      if (!Object.keys(projects.owned).includes(incoming.id)) {
        dispatch(projectsActions.createProject(incoming))
      }
    },
    error: error => console.warn(error)
  }))
  observers.push(API.graphql(graphqlOperation(subscriptions.onImportOwnedProjects, data)).subscribe({
    next: e => {
      const { projects } = getState()
      const incoming = e.value.data.onImportOwnedProjects.items
      for (const project of incoming) {
        if (!Object.keys(projects.owned).includes(project.id)) {
          dispatch(projectsActions.createProject(project))
        }
      }
    },
    error: error => console.warn(error)
  }))
  observers.push(API.graphql(graphqlOperation(subscriptions.onUpdateOwnedProject, data)).subscribe({
    next: e => {
      const { projects } = getState()
      const incoming = e.value.data.onUpdateOwnedProject
      if (Object.keys(projects.owned).includes(incoming.id)) {
        dispatch(projectsActions.updateProject(incoming))
      }
    },
    error: error => console.warn(error)
  }))
  observers.push(API.graphql(graphqlOperation(subscriptions.onDeleteOwnedProject, data)).subscribe({
    next: e => {
      const { app, projects } = getState()
      const removedItemID = e.value.data.onDeleteOwnedProject.id;
      if (Object.keys(projects.owned).includes(removedItemID)) {
        if (app.selectedProject === removedItemID) {
          dispatch(appActions.handleSetNote(null))
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

export const handleSetNotesObservers = (projectID) => (dispatch, getState) => {
  const { user, app, projects } = getState()
  if (app.selectedProject === projectID) {
    const observers = [];
    if (Object.keys(projects["owned"]).includes(projectID)) {
      observers.push(API.graphql(graphqlOperation(subscriptions.onCreateOwnedNoteByProjectId, { projectID })).subscribe({
        next: e => {
          const { notes } = getState()
          const incoming = e.value.data.onCreateOwnedNoteByProjectID
          if (!Object.keys(notes).includes(incoming.id)) {
            dispatch(notesActions.createNote(incoming))
          }
        },
        error: error => console.warn(error)
      }))
      observers.push(API.graphql(graphqlOperation(subscriptions.onUpdateOwnedNoteByProjectId, { projectID })).subscribe({
        next: e => {
          const { notes } = getState()
          const incoming = e.value.data.onUpdateOwnedNoteByProjectID
          if (Object.keys(notes).includes(incoming.id)) {
            dispatch(notesActions.updateNote(incoming))
          }
        },
        error: error => console.warn(error)
      }))
      observers.push(API.graphql(graphqlOperation(subscriptions.onDeleteOwnedNoteByProjectId, { projectID })).subscribe({
        next: e => {
          const { notes, app } = getState()
          const removedItemID = e.value.data.onDeleteOwnedNoteByProjectID.id;
          if (Object.keys(notes).includes(removedItemID)) {
            if (app.selectedNote === removedItemID) {
              dispatch(appActions.handleSetNote(null))
            }
            dispatch(notesActions.removeNote(removedItemID))
          }
        },
        error: error => console.warn(error)
      }))
    } else if (Object.keys(projects["assigned"]).includes(projectID)) {
      const data = {
        projectID,
        assignee: user.data.username
      }
      observers.push(API.graphql(graphqlOperation(subscriptions.onUpdateAssignedNoteByProjectId, data)).subscribe({
        next: e => {
          const { notes } = getState()
          const incoming = e.value.data.onUpdateAssignedNoteByProjectID
          if (Object.keys(notes).includes(incoming.id)) {
            dispatch(notesActions.updateNote(incoming))
          }
        },
        error: error => console.warn(error)
      }))
      observers.push(API.graphql(graphqlOperation(subscriptions.onDeleteAssignedNoteByProjectId, data)).subscribe({
        next: e => {
          const { notes, app } = getState()
          const removedItemID = e.value.data.onDeleteAssignedNoteByProjectID.id;
          if (Object.keys(notes).includes(removedItemID)) {
            if (app.selectedNote === removedItemID) {
              dispatch(appActions.handleSetNote(null))
            }
            dispatch(notesActions.removeNote(removedItemID))
          }
        },
        error: error => console.warn(error)
      }))
    }
    return dispatch(setNotesObservers(observers))
  }
}

export const handleClearNotesObservers = () => (dispatch, getState) => {
  const { observers } = getState()
  if (observers.notes) {
    for (const observer of observers.notes) {
      observer.unsubscribe()
    }
  }
  return dispatch(clearNotesObservers())
}

export const handleSetCommentsObservers = (noteID) => (dispatch, getState) => {
  const { app } = getState()
    if (app.selectedNote === noteID) {
    const observers = [];
    observers.push(API.graphql(graphqlOperation(subscriptions.onCreateCommentByNoteId, { noteID })).subscribe({
      next: e => {
        const { comments } = getState()
        const incoming = e.value.data.onCreateCommentByNoteID
        if (!Object.keys(comments).includes(incoming.id)) {
          dispatch(commentsActions.createComment(incoming))
        }
      },
      error: error => console.warn(error)
    }))
    observers.push(API.graphql(graphqlOperation(subscriptions.onUpdateCommentByNoteId, { noteID })).subscribe({
      next: e => {
        const { comments } = getState()
        const incoming = e.value.data.onUpdateCommentByNoteID
        if (Object.keys(comments).includes(incoming.id)) {
          dispatch(commentsActions.updateComment(incoming))
        }
      },
      error: error => console.warn(error)
    }))
    observers.push(API.graphql(graphqlOperation(subscriptions.onDeleteCommentByNoteId, { noteID })).subscribe({
      next: e => {
        const { comments } = getState()
        const removedItemID = e.value.data.onDeleteCommentByNoteID.id;
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