import { SET_PROJECT, SET_NOTE, SET_DROPDOWN, SET_COMMAND, SET_LOADING, SET_PROJECT_ADDING_STATUS, SET_NOTE_ADDING_STATUS, SET_HISTORY } from "../actions/app"
import { OK } from "../constants"

const initState = {
  selectedProject: null,
  selectedProjectScope: null,
  selectedNote: null,
  command: "",
  isDropdownOpened: false,
  projectsTab: "owned",
  projectAddingStatus: OK,
  noteAddingStatus: OK,
  history: null,
  isLoading: true
}

export default function (state = initState, action) {
  switch(action.type) {
    case SET_PROJECT:
      return {...state, selectedProject: action.id, selectedProjectScope: action.scope}
    case SET_NOTE:
      return {...state, selectedNote: action.id}
    case SET_COMMAND:
      return {...state, command: action.command}
    case SET_DROPDOWN:
      return {...state, isDropdownOpened: action.status}
    case SET_PROJECT_ADDING_STATUS:
      return {...state, projectAddingStatus: action.status}
    case SET_NOTE_ADDING_STATUS:
      return {...state, noteAddingStatus: action.status}
    case SET_HISTORY:
      return {...state, history: action.history}
    case SET_LOADING:
      return {...state, isLoading: action.isLoading}
    default:
      return state
  }
}