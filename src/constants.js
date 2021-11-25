import generateID from './utils/generateID'
import generateRandomWords from './utils/generateRandomWords';

export const PENDING = "PENDING"
export const OK = "OK"
export const CREATING = "CREATING"
export const REMOVING = "REMOVING"
export const LOADING = "LOADING"
export const READY = "READY"
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
    alias: "a"
  },
  STATUS: {
    description: "Change status of the task",
    alias: null
  },
  DESCRIPTION: {
    description: "Add a long description to the task",
    alias: null
  },
  DUE: {
    description: "Set a deadline date for the task",
    alias: null
  },
  TAGS: {
    description: "Add comma separated tags",
    alias: null
  },
  COPY: {
    description: "Copy this task to the clipboard",
    alias: null
  },
  DUPLICATE: {
    description: "Create a clone for the selected task",
    alias: null
  },
  DELETE: {
    description: "Delete this task permanently",
    alias: null
  }
}

export const panelPages = {
  TASK_HUB: "TASK_HUB",
  PROJECTS: "PROJECTS",
  NOTIFICATIONS: "NOTIFICATIONS",
  ASSIGNEE_CHOOSER: "ASSIGNEE_CHOOSER",
  WATCHER_CHOOSER: "WATCHER_CHOOSER",
  ACCOUNT_SETTINGS: "ACCOUNT_SETTINGS",
  PROJECT_SETTINGS: "PROJECT_SETTINGS",
  APP_SETTINGS: "APP_SETTINGS"
}

export const initProjectState = (prevProject = null, nextProject = null) => {
  return {
    id: generateID(),
    title: null,
    permalink: generateRandomWords().join("-"),
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
  id: generateID(),
  projectID: projectID,
  task: "",
  prevTask: prevTask,
  nextTask: nextTask,
  description: null,
  due: null,
  tags: [],
  assignees: [],
  status: "todo",
  priority: "normal"
})

export const AuthState = {
  SignUp: "signup",
  SignOut: "signout",
  SignIn: "signin",
  Loading: "loading",
  SignedOut: "signedout",
  SignedIn: "signedin",
  SigningUp: "signingup",
  ConfirmSignUp: "confirmSignUp",
  confirmingSignUpCustomFlow: "confirmsignupcustomflow",
  ConfirmSignIn: "confirmSignIn",
  confirmingSignInCustomFlow: "confirmingsignincustomflow",
  VerifyingAttributes: "verifyingattributes",
  ForgotPassword: "forgotpassword",
  ResetPassword: "resettingpassword",
  SettingMFA: "settingMFA",
  TOTPSetup: "TOTPSetup",
  CustomConfirmSignIn: "customConfirmSignIn",
  VerifyContact: "verifyContact"
}