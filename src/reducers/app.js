import { SET_PROJECT, SET_TASK, SET_DROPDOWN, SET_COMMAND, SET_LOADING, SET_PROJECT_ADDING_STATUS, SET_TASK_ADDING_STATUS, SET_HISTORY, SET_PROJECT_PANEL, SET_DETAILS_PANEL, SET_ACTION_SHEET, SET_PROJECT_TITLE } from "../actions/app"
import { OK } from "../constants"

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
  isProjectsPanelOpened: false,
  isDetailsPanelOpened: false,
  isActionSheetOpened: false,
  isProjectTitleSelected: false
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
      return {...state, isProjectsPanelOpened: action.status}
    case SET_DETAILS_PANEL:
      return {...state, isDetailsPanelOpened: action.status}
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
    case SET_LOADING:
      return {...state, isLoading: action.isLoading}
    default:
      return state
  }
}