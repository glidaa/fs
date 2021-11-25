import { SET_PROJECTS_STATUS, SET_TASKS_STATUS, SET_COMMENTS_STATUS } from "../actions/status"
import { READY } from "../constants"

const initState = {
  projects: READY,
  tasks: READY,
  comments: READY
}

export default function (state = initState, action) {
  switch(action.type) {
    case SET_PROJECTS_STATUS:
      return {...state, projects: action.status}
    case SET_TASKS_STATUS:
      return {...state, tasks: action.status}
    case SET_COMMENTS_STATUS:
      return {...state, comments: action.status}
    default:
      return state
  }
}