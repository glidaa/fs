import { rword } from 'rword';
import { v4 as uuidv4 } from 'uuid';

export const PENDING = "PENDING"
export const OK = "OK"
export const NOT_ASSIGNED = "NOT_ASSIGNED"

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
  ASSIGN: {
    description: "Search for a user to assign him",
    alias: []
  },
  STATUS: {
    description: "Change status of the task",
    alias: []
  },
  DESCRIPTION: {
    description: "Add a long description to the task",
    alias: []
  },
  DUE: {
    description: "Set a deadline date for the task",
    alias: []
  },
  TAGS: {
    description: "Add comma separated tags",
    alias: []
  },
  COPY: {
    description: "Copy this task to the clipboard",
    alias: []
  },
  DUPLICATE: {
    description: "Create a clone for the selected task",
    alias: []
  },
  REORDER: {
    description: "Enter a new order for the task",
    alias: []
  },
  DELETE: {
    description: "Delete this task permanently",
    alias: []
  }
}

export const panelPages = {
  DETAILS: "DETAILS",
  PROJECTS: "PROJECTS",
  NOTIFICATIONS: "NOTIFICATIONS",
  ASSIGNEE_CHOOSER: "ASSIGNEE_CHOOSER",
  WATCHER_CHOOSER: "WATCHER_CHOOSER",
  ACCOUNT_SETTINGS: "ACCOUNT_SETTINGS",
  PROJECT_SETTINGS: "PROJECT_SETTINGS"
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