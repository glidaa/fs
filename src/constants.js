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
  'Mark this task as done',
  'Mark this task as undone',
  'Copy this task',
  'Duplicate this task',
  'Add a description to this task',
  'Logout'
]

export const commandIntents = {
  ASSIGN: "ASSIGN",
  STATUS: "STATUS",
  DESCRIPTION: "DESCRIPTION",
  DUE: "DUE",
  TAGS: "TAGS",
  COPY: "COPY",
  DUPLICATE: "DUPLICATE",
  REORDER: "REORDER",
  DELETE: "DELETE",
  UNKNOWN: "UNKNOWN"
}

export const supportedCommands = {
  ASSIGN: "assign",
  STATUS: "status",
  DESCRIPTION: "description",
  DUE: "due",
  TAGS: "tags",
  COPY: "copt",
  DUPLICATE: "duplicate",
  REORDER: "reorder",
  DELETE: "delete"
}

export const panelPages = {
  DETAILS: "DETAILS",
  PROJECTS: "PROJECTS",
  NOTIFICATIONS: "NOTIFICATIONS",
  ASSIGNEE_CHOOSER: "ASSIGNEE_CHOOSER",
  WATCHER_CHOOSER: "WATCHER_CHOOSER"
}

export const initProjectState = (prevProject = null, nextProject = null) => {
  const randomWords = rword.generate(2, { capitalize: 'first' })
  return {
    id: uuidv4(),
    title: randomWords.join(" "),
    permalink: randomWords.join("-").toLowerCase(),
    prevProject: prevProject,
    nextProject: nextProject,
    todoCount: 0,
    pendingCount: 0,
    doneCount: 0,
    privacy: "public",
    permissions: "rw",
    members: [],
    createdAt: new Date().toISOString()
  }
}

export const initTaskState = (projectID, prevTask = null, nextTask = null) => ({
  id: uuidv4(),
  projectID: projectID,
  task: "",
  prevTask: prevTask,
  nextTask: nextTask,
  description: null,
  due: Date.now(),
  tags: [],
  assignees: [],
  status: "todo"
})