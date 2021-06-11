import { Auth } from "aws-amplify";
import { AuthState } from '@aws-amplify/ui-components';
import * as notesActions from "./notes"
import * as observersActions from "./observers"
import * as commentsActions from "./comments"
import * as userActions from "./user"
import {
  SIGNIN,
  SIGNUP,
  MARKASDONE,
  SIGNOUT,
  MARKASUNDONE,
  DESCRIPTION,
  DUPLICATE,
  COPY
} from "../constants";
import copyNote from "../utils/copyNote";
import parseLinkedList from "../utils/parseLinkedList";

export const SET_PROJECT = "SET_PROJECT";
export const SET_NOTE = "SELECT_NOTE";
export const SET_COMMAND = "SET_COMMAND";
export const SET_DROPDOWN = "OPEN_DROPDOWN";
export const SET_PROJECT_ADDING_STATUS = "SET_PROJECT_ADDING_STATUS";
export const SET_NOTE_ADDING_STATUS = "SET_NOTE_ADDING_STATUS";
export const SET_HISTORY = "SET_HISTORY";
export const SET_LOADING = "SET_LOADING";

const setProject = (id, scope) => ({
  type: SET_PROJECT,
  id,
  scope
});

const setNote = (id) => ({
  type: SET_NOTE,
  id
});

const setCommand = (command) => ({
  type: SET_COMMAND,
  command
});

export const setDropdown = (status) => ({
  type: SET_DROPDOWN,
  status
});

export const setProjectAddingStatus = (status) => ({
  type: SET_PROJECT_ADDING_STATUS,
  status
});

export const setNoteAddingStatus = (status) => ({
  type: SET_NOTE_ADDING_STATUS,
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

export const handleSetProject = (id, shouldChangeURL = true) => (dispatch, getState) => {
  const { user, app, projects } = getState()
  if (app.selectedProject !== id) {
    dispatch(observersActions.handleClearNotesObservers())
    dispatch(handleSetNote(null));
    dispatch(notesActions.emptyNotes());
    if (id) {
      if (projects["owned"][id]) {
        dispatch(setProject(id, "owned"))
        if (shouldChangeURL) {
          if (user.state === AuthState.SignedIn) {
            app.history.push(`/${projects["owned"][id].owner}/${projects["owned"][id].permalink}`)
          } else {
            app.history.push(`/local/${projects["owned"][id].permalink}`)
          }
        }
      } else if (projects["assigned"][id]) {
        dispatch(setProject(id, "assigned"))
        if (shouldChangeURL) {
          app.history.push(`/${projects["assigned"][id].owner}/${projects["assigned"][id].permalink}`)
        }
      }
      dispatch(notesActions.handleFetchNotes(id))
      if (user.state === AuthState.SignedIn) {
        dispatch(observersActions.handleSetNotesObservers(id))
      }
    } else {
      if (shouldChangeURL) {
        app.history.push("/")
      }
      dispatch(setProject(null, null))
    }
  }
}

export const handleSetNote = (id, shouldChangeURL = true) => (dispatch, getState) => {
  const { user, projects, notes, app } = getState()
  dispatch(observersActions.handleClearCommentsObservers())
  if (!id && app.selectedNote) {
    if (shouldChangeURL) {
      if (app.selectedProject && user.state === AuthState.SignedIn) {
        app.history.push(`/${projects[app.selectedProjectScope][app.selectedProject].owner}/${projects[app.selectedProjectScope][app.selectedProject].permalink}`)
      }
    }
    dispatch(setCommand(""))
    dispatch(setDropdown(false))
    dispatch(setNote(null))
  } else if (!id) {
    dispatch(setNote(null))
  } else {
    if (shouldChangeURL) {
      if (app.selectedProject && user.state === AuthState.SignedIn) {
        app.history.push(`/${projects[app.selectedProjectScope][app.selectedProject].owner}/${projects[app.selectedProjectScope][app.selectedProject].permalink}/${notes[id].permalink}`)
      }
    }
    dispatch(setNote(id))
    dispatch(commentsActions.handleFetchComments(id))
    if (user.state === AuthState.SignedIn) {
      dispatch(observersActions.handleSetCommentsObservers(id))
    }
  }
}

export const handleSetCommand = (command) => (dispatch, getState) => {
  const { user, notes, app } = getState()
  if (command) {
    const tokens = /^(\/\w?)(.*)$/m.exec(command)
    dispatch(setDropdown(false))
    switch (tokens[1]) {
      case SIGNIN:
        if (user.state !== AuthState.SignedIn) {
          dispatch(setCommand(command))
          dispatch(handleSetNote(null))
          return app.history.push("/login")
        }
        return dispatch(setCommand(command.slice(0, -1)))
      case SIGNUP:
        if (user.state !== AuthState.SignedIn) {
          dispatch(setCommand(command))
          dispatch(handleSetNote(null))
          return app.history.push("/login")
        }
        return dispatch(setCommand(command.slice(0, -1)))
      case SIGNOUT:
        if (user.state === AuthState.SignedIn) {
          dispatch(setCommand(command))
          dispatch(handleSetNote(null))
          dispatch(observersActions.handleClearNotesObservers())
          dispatch(userActions.setState(AuthState.signOut))
          dispatch(userActions.handleSetData(null))
          Auth.signOut()
          return dispatch(notesActions.emptyNotes())
        }
        return dispatch(setCommand(command.slice(0, -1)))
      case MARKASDONE:
        dispatch(setCommand(command))
        dispatch(notesActions.handleUpdateNote({
          id: app.selectedNote,
          isDone: true
        }))
        return dispatch(handleSetNote(null))
      case MARKASUNDONE:
        dispatch(setCommand(command))
        dispatch(notesActions.handleUpdateNote({
          id: app.selectedNote,
          isDone: false
        }))
        return dispatch(handleSetNote(null))
      case DESCRIPTION:
        dispatch(setCommand(command))
        return dispatch(notesActions.handleUpdateNote({
          id: app.selectedNote,
          description: tokens[2].trim()
        }))
      case DUPLICATE:
        dispatch(setCommand(command))
        dispatch(notesActions.handleCreateNote(
          copyNote(
            notes[app.selectedNote],
            app.selectedProject,
            parseLinkedList(
              notes,
              "prevNote",
              "nextNote"
            ).reverse()[0]?.id
          )
        ))
        return dispatch(handleSetNote(null))
      case COPY:
        dispatch(setCommand(command))
        window.localStorage.setItem("notesClipboard",
          "COPIEDNOTESTART=>" +
          JSON.stringify(notes[app.selectedNote]) +
          "<=COPIEDNOTEEND"
        )
        return dispatch(handleSetNote(null))
      case "/":
        dispatch(setDropdown(true))
        return dispatch(setCommand(command))
      default:
        dispatch(setDropdown(true))
        return dispatch(setCommand("/"))
    }
  }
  return dispatch(setCommand(""))
}