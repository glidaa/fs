import { rword } from 'rword';
import { v4 as uuidv4 } from 'uuid';

export const PENDING = "PENDING"
export const OK = "OK"
export const NOT_ASSIGNED = "NOT_ASSIGNED"

export const SIGNIN = '/s';
export const SIGNUP = '/l';
export const MARKASDONE = '/x';
export const MARKASUNDONE = '/u';
export const COPY = '/c';
export const DUPLICATE = '/b';
export const DESCRIPTION = '/d';
export const SIGNOUT = '/q';
export const suggestionsList =  [
  's',
  'l',
  'x',
  'u',
  'c',
  'b',
  'd',
  'q'
]

export const suggestionsDescription = [
  'Login to save your tasks',
  'Create a new account',
  'Mark this note as done',
  'Mark this note as undone',
  'Copy this note',
  'Duplicate this note',
  'Add a description to this note',
  'Logout'
]

export const initProjectState = (prevProject = null, nextProject = null) => {
  const randomWords = rword.generate(2, { capitalize: 'first' })
  return {
    id: uuidv4(),
    title: randomWords.join(" "),
    permalink: randomWords.join("-").toLowerCase(),
    prevProject: prevProject,
    nextProject: nextProject,
    createdAt: new Date().toISOString()
  }
}

export const initNoteState = (projectID, prevNote = null, nextNote = null) => ({
  id: uuidv4(),
  projectID: projectID,
  note: "",
  prevNote: prevNote,
  nextNote: nextNote,
  isDone: false,
  task: null,
  description: null,
  steps: null,
  due: Date.now(),
  watcher: null,
  tag: null,
  sprint: null,
  status: null
})