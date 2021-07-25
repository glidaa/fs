import { API, graphqlOperation } from "aws-amplify";
import { AuthState } from '@aws-amplify/ui-components';
import { listNotesForProject } from "../graphql/queries"
import injectItemOrder from "../utils/injectItemOrder"
import removeItemOrder from "../utils/removeItemOrder"
import * as appActions from "./app"
import * as usersActions from "./users"
import * as mutations from "../graphql/mutations"
import { DONE, ERROR, NOT_ASSIGNED, NOT_STARTED, OK, PENDING } from "../constants";
import prepareNoteToBeSent from "../utils/prepareNoteToBeSent";

export const CREATE_NOTE = "CREATE_NOTE";
export const UPDATE_NOTE = "UPDATE_NOTE";
export const REMOVE_NOTE = "REMOVE_NOTE";
export const EMPTY_NOTES = "EMPTY_NOTES";
export const FETCH_NOTES = "FETCH_NOTES";

export const createNote = (noteState) => ({
  type: CREATE_NOTE,
  noteState
});

export const updateNote = (update) => ({
  type: UPDATE_NOTE,
  update
});

export const removeNote = (id) => ({
  type: REMOVE_NOTE,
  id
});

export const emptyNotes = () => ({
  type: EMPTY_NOTES
});

const fetchNotes = (notes) => ({
  type: FETCH_NOTES,
  notes
});

export const handleCreateNote = (noteState) => (dispatch, getState) => {
  const { user } = getState()
  if (user.state === AuthState.SignedIn) {
    dispatch(appActions.setNoteAddingStatus(PENDING))
    const dataToSend = prepareNoteToBeSent(noteState)
    return API.graphql(graphqlOperation(mutations.createNote, { input: dataToSend }))
      .then((incoming) => {
        if (noteState.projectID === getState().app.selectedProject) {
          dispatch(createNote(incoming.data.createNote))
          if (noteState.projectID === getState().app.selectedProject) {
            dispatch(appActions.handleSetNote(null))
          }
          dispatch(appActions.handleSetNote(incoming.data.createNote.id))
        }
        dispatch(appActions.setNoteAddingStatus(OK))
      })
      .catch((err) => {
        console.error(err)
        dispatch(appActions.setNoteAddingStatus(OK))
      })
  } else {
    if (noteState.projectID === getState().app.selectedProject) {
      dispatch(createNote(noteState))
      if (noteState.projectID === getState().app.selectedProject) {
        dispatch(appActions.handleSetNote(null))
      }
      dispatch(appActions.handleSetNote(noteState.id))
    }
    const localProjects = JSON.parse(window.localStorage.getItem("projects"))
    const notesArray = localProjects[noteState.projectID].notes
    let notesList = {}
    for (const note of notesArray) {
      notesList[note.id] = note
    }
    notesList = injectItemOrder(
      notesList,
      noteState,
      noteState.prevNote,
      noteState.nextNote,
      "prevNote",
      "nextNote"
    )
    notesList = {...notesList, [noteState.id]: noteState}
    localProjects[noteState.projectID].notes = Object.values(notesList)
    return window.localStorage.setItem("projects", JSON.stringify(localProjects))
  }
}

export const handleUpdateNote = (update) => (dispatch, getState) => {
  const { user, notes, app } = getState()
  const prevNoteState = {...notes[update.id]}
  const prevCommands = app.commands
  if (update.task) {
    const tokens = /^(.*?)(\/.*||)$/m.exec(update.task)
    update.task = tokens[1];
    dispatch(appActions.handleSetCommand(tokens[2]))
  }
  const updateWithID = {id: prevNoteState.id, ...update };
  if (user.state === AuthState.SignedIn) {
    if (notes[prevNoteState.id]) {
      dispatch(updateNote(updateWithID))
    }
    return API.graphql(graphqlOperation(mutations.updateNote, { input: updateWithID }))
      .catch(() => {
        if (notes[prevNoteState.id]) {
          dispatch(appActions.handleSetCommand(prevCommands))
          return dispatch(updateNote(prevNoteState))
        }
      })
  } else {
    if (notes[prevNoteState.id]) {
      dispatch(updateNote(updateWithID));
    }
    const localProjects = JSON.parse(window.localStorage.getItem("projects"))
    const notesArray = localProjects[prevNoteState.projectID].notes
    let notesList = {}
    for (const note of notesArray) {
      notesList[note.id] = note
    }
    if (update.prevNote !== undefined && update.nextNote !== undefined) {
      notesList = removeItemOrder(
        notesList,
        notesList[update.id],
        "prevNote",
        "nextNote"
      )
      notesList = injectItemOrder(
        notesList,
        notesList[update.id],
        update.prevNote,
        update.nextNote,
        "prevNote",
        "nextNote"
      )
    }
    notesList = {
      ...notesList,
      [update.id]: {
        ...notesList[update.id],
        ...update
    }}
    localProjects[prevNoteState.projectID].notes = Object.values(notesList)
    return window.localStorage.setItem("projects", JSON.stringify(localProjects))
  }
}

export const handleRemoveNote = (noteState) => (dispatch, getState) => {
  const { user, notes, app } = getState()
  if (app.selectedNote === noteState.id) {
    dispatch(appActions.handleSetNote(null))
  }
  if (user.state === AuthState.SignedIn) {
    if (notes[noteState.id]) {
      dispatch(removeNote(noteState.id))
    }
    return API.graphql(graphqlOperation(mutations.deleteNoteAndComments, { noteId: noteState.id }))
      .catch(() => {
        if (notes[noteState.id]) {
          dispatch(createNote(noteState))
        }
      })
  } else {
    if (notes[noteState.id]) {
      dispatch(removeNote(noteState.id))
    }
    const localProjects = JSON.parse(window.localStorage.getItem("projects"))
    const notesArray = localProjects[noteState.projectID].notes
    let notesList = {}
    for (const note of notesArray) {
      notesList[note.id] = note
    }
    notesList = removeItemOrder(
      notesList,
      notesList[noteState.id],
      "prevNote",
      "nextNote"
    )
    delete notesList[noteState.id]
    localProjects[noteState.projectID].notes = Object.values(notesList)
    return window.localStorage.setItem("projects", JSON.stringify(localProjects))
  }
}

export const handleFetchNotes = (projectID) => async (dispatch, getState) => {
  const { user } = getState()
  dispatch(appActions.handleSetNote(null))
  if (user.state === AuthState.SignedIn) {
    try {
      const res = await API.graphql(graphqlOperation(listNotesForProject, { projectID }))
      const items = res.data.listNotesForProject.items
      for (const item of items) {
        if (item.assignee !== NOT_ASSIGNED) {
          dispatch(usersActions.handleAddUser(item.assignee))
        }
      }
      dispatch(fetchNotes(items))
      return getState().notes
    } catch (err) {
      console.error(err)
    }
  } else {
    const localProjects = JSON.parse(window.localStorage.getItem("projects"))
    if (localProjects?.[projectID].notes) {
      dispatch(fetchNotes(localProjects[projectID].notes))
    } else {
      dispatch(fetchNotes([]))
    }
    return getState().notes
  }
}