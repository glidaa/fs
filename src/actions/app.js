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
  COPY,
  commandIntents,
  supportedCommands
} from "../constants";
import copyNote from "../utils/copyNote";
import parseLinkedList from "../utils/parseLinkedList";

export const SET_PROJECT = "SET_PROJECT";
export const SET_NOTE = "SET_NOTE";
export const SET_COMMAND = "SET_COMMAND";
export const SET_DROPDOWN = "SET_DROPDOWN";
export const SET_PROJECT_ADDING_STATUS = "SET_PROJECT_ADDING_STATUS";
export const SET_NOTE_ADDING_STATUS = "SET_NOTE_ADDING_STATUS";
export const SET_HISTORY = "SET_HISTORY";
export const SET_LOADING = "SET_LOADING";
export const SET_PROJECT_PANEL = "SET_PROJECT_PANEL";
export const SET_DETAILS_PANEL = "SET_DETAILS_PANEL";
export const SET_ACTION_SHEET = "SET_ACTION_SHEET";
export const SET_PROJECT_TITLE = "SET_PROJECT_TITLE";

const setProject = (id, scope) => ({
  type: SET_PROJECT,
  id,
  scope
});

const setNote = (id) => ({
  type: SET_NOTE,
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

export const setActionSheet = (status) => ({
  type: SET_ACTION_SHEET,
  status
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
  dispatch(setProjectTitle(false))
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
    if (app.isDetailsPanelOpened) {
      dispatch(setDetailsPanel(false))
    }
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

export const handleSetProjectTitle = (status) => (dispatch) => {
  if (status) {
    dispatch(handleSetNote(null))
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
  const { user, notes, app } = getState()
  dispatch(setCommand("", null))
  if (app.command) {
    const tokens = /^\/(\w*)\s*(.*)\s*$/m.exec(app.command)
    dispatch(setDropdown(false))
    switch (tokens[1]) {
      case supportedCommands.STATUS:
        dispatch(notesActions.handleUpdateNote({
          id: app.selectedNote,
          status: tokens[2]
        }))
        break
      case supportedCommands.DESCRIPTION:
        return dispatch(notesActions.handleUpdateNote({
          id: app.selectedNote,
          description: tokens[2].trim()
        }))
      case supportedCommands.DUE:
        return dispatch(notesActions.handleUpdateNote({
          id: app.selectedNote,
          due: (new Date(tokens[2])).getTime()
        }))
      case supportedCommands.TAGS:
        return dispatch(notesActions.handleUpdateNote({
          id: app.selectedNote,
          tag: [
            ...notes[app.selectedNote].tags,
            ...tokens[2].split(",").map(x => x.trim())
          ]
        }))
      case supportedCommands.DUPLICATE:
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
      case supportedCommands.COPY:
        window.localStorage.setItem("notesClipboard",
          "COPIEDNOTESTART=>" +
          JSON.stringify(notes[app.selectedNote]) +
          "<=COPIEDNOTEEND"
        )
        return dispatch(handleSetNote(null))
      case "/":
        dispatch(setDropdown(true))
        return dispatch(setCommand(app.command))
      default:
        dispatch(setDropdown(true))
        return dispatch(setCommand("/"))
    }
  }
}