import { SET_PROJECT, SET_TASK, SET_DROPDOWN, SET_COMMAND, SET_LOADING, SET_PROJECT_ADDING_STATUS, SET_TASK_ADDING_STATUS, SET_HISTORY, SET_PROJECT_PANEL, SET_DETAILS_PANEL, SET_ACTION_SHEET, SET_PROJECT_TITLE, SET_LOCKED_TASK_FIELD, SET_RIGHT_PANEL_PAGE, SET_LEFT_PANEL_PAGE } from "../actions/app"
import { panelPages, OK } from "../constants"

const initState = {
  selectedProject: null,
  selectedProjectScope: null,
  selectedTask: null,
  command: "",
  commandIntent: null,
  isDropdownOpened: false,
  projectsTab: "owned",
  projectAddingStatus: OK,
  taskAddingStatus: OK,
  history: null,
  isLoading: true,
  isLeftPanelOpened: false,
  isRightPanelOpened: false,
  isActionSheetOpened: false,
  isProjectTitleSelected: false,
  lockedTaskField: null,
  rightPanelPage: panelPages.DETAILS,
  leftPanelPage: panelPages.PROJECTS
}

export default function (state = initState, action) {
  switch(action.type) {
    case SET_PROJECT:
      return {...state, selectedProject: action.id, selectedProjectScope: action.scope}
    case SET_TASK:
      return {...state, selectedTask: action.id}
    case SET_COMMAND:
      return {...state, command: action.command, commandIntent: action.intent}
    case SET_DROPDOWN:
      return {...state, isDropdownOpened: action.status}
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
    case SET_HISTORY:
      return {...state, history: action.history}
    case SET_LOCKED_TASK_FIELD:
      return {...state, lockedTaskField: action.fieldName}
    case SET_RIGHT_PANEL_PAGE:
      return {...state, rightPanelPage: action.page}
    case SET_LEFT_PANEL_PAGE:
      return {...state, leftPanelPage: action.page}
    case SET_LOADING:
      return {...state, isLoading: action.isLoading}
    default:
      return state
  }
}