import { SET_PROJECT, SET_TASK, SET_COMMAND, SET_PROJECT_ADDING_STATUS, SET_TASK_ADDING_STATUS, SET_NAVIGATE, SET_PROJECT_PANEL, SET_DETAILS_PANEL, SET_ACTION_SHEET, SET_PROJECT_TITLE, SET_LOCKED_TASK_FIELD, SET_RIGHT_PANEL_PAGE, SET_LEFT_PANEL_PAGE, SET_OFFLINE, SET_SYNCED } from "../actions/app"
import { panelPages, OK } from "../constants"

const initState = {
  selectedProject: null,
  selectedTask: null,
  command: "",
  projectsTab: "owned",
  projectAddingStatus: OK,
  taskAddingStatus: OK,
  navigate: null,
  isOffline: false,
  isSynced: true,
  isLeftPanelOpened: false,
  isRightPanelOpened: false,
  isActionSheetOpened: false,
  isProjectTitleSelected: false,
  lockedTaskField: null,
  rightPanelPage: panelPages.TASK_HUB,
  leftPanelPage: panelPages.PROJECTS
}

export default function (state = initState, action) {
  switch(action.type) {
    case SET_PROJECT:
      return {...state, selectedProject: action.id}
    case SET_TASK:
      return {...state, selectedTask: action.id}
    case SET_COMMAND:
      return {...state, command: action.command}
    case SET_PROJECT_PANEL:
      return {...state, isLeftPanelOpened: action.status}
    case SET_DETAILS_PANEL:
      return {...state, isRightPanelOpened: action.status}
    case SET_ACTION_SHEET:
      return {...state, isActionSheetOpened: action.status}
    case SET_PROJECT_TITLE:
      return {...state, isProjectTitleSelected: action.status}
    case SET_PROJECT_ADDING_STATUS:
      return {...state, projectAddingStatus: action.status}
    case SET_TASK_ADDING_STATUS:
      return {...state, taskAddingStatus: action.status}
    case SET_NAVIGATE:
      return {...state, navigate: action.navigate}
    case SET_LOCKED_TASK_FIELD:
      return {...state, lockedTaskField: action.fieldName}
    case SET_RIGHT_PANEL_PAGE:
      return {...state, rightPanelPage: action.page}
    case SET_LEFT_PANEL_PAGE:
      return {...state, leftPanelPage: action.page}
    case SET_OFFLINE:
      return {...state, isOffline: action.isOffline}
    case SET_SYNCED:
      return {...state, isSynced: action.isSynced}
    default:
      return state
  }
}