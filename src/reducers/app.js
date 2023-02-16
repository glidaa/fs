import { SET_PROJECT, SET_TASK, SET_LEFT_PANEL, SET_RIGHT_PANEL, SET_PROJECT_TITLE, SET_LOCKED_TASK_FIELD, SET_RIGHT_PANEL_PAGE, SET_LEFT_PANEL_PAGE, SET_OFFLINE, SET_SYNCED, BATCH_SELECT_TASK, BATCH_DESELECT_TASK } from "../actions/app"

const initState = {
  selectedProject: null,
  selectedTask: null,
  selectedTasks: null,
  navigate: null,
  isOffline: false,
  isSynced: true,
  isLeftPanelOpened: false,
  isRightPanelOpened: false,
  isProjectTitleSelected: false,
  lockedTaskField: null,
  rightPanelPage: null,
  leftPanelPage: null
}

const appReducer = (state = initState, action) => {
  switch(action.type) {
    case SET_PROJECT:
      return {...state, selectedProject: action.id}
    case SET_TASK:
      return {...state, selectedTask: action.id}
    case BATCH_SELECT_TASK:
      if (!state.selectedTasks) {
        return {...state, selectedTasks: [action.id]}
      } else if (state.selectedTasks.includes(action.id)) {
        return { ...state }
      } else {
        return {...state, selectedTasks: [...state.selectedTasks, action.id] }
      }
    case BATCH_DESELECT_TASK:
      if (state.selectedTasks?.length === 1) {
        if (state.selectedTasks[0] === action.id) {
          return {...state, selectedTasks: null}
        }
      } else if (state.selectedTasks?.includes(action.id)) {
        return {...state, selectedTasks: state.selectedTasks.filter(id => id !== action.id)}
      }
      return {...state}
    case SET_LEFT_PANEL:
      return {...state, isLeftPanelOpened: action.status}
    case SET_RIGHT_PANEL:
      return {...state, isRightPanelOpened: action.status}
    case SET_PROJECT_TITLE:
      return {...state, isProjectTitleSelected: action.status}
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

export default appReducer;
