import { SET_NOTIFICATIONS_STATUS, SET_PROJECTS_STATUS, SET_TASKS_STATUS, SET_ATTACHMENTS_STATUS, SET_COMMENTS_STATUS, SET_HISTORY_STATUS } from "../actions/status"
import { ThingStatus } from "../constants"

const initState = {
  notifications: ThingStatus.FETCHING,
  projects: ThingStatus.FETCHING,
  tasks: ThingStatus.FETCHING,
  attachments: ThingStatus.FETCHING,
  comments: ThingStatus.FETCHING,
  history: ThingStatus.FETCHING,
}

const statusReducer = (state = initState, action) => {
  switch(action.type) {
  case SET_NOTIFICATIONS_STATUS:
    return {...state, notifications: action.status}
    case SET_PROJECTS_STATUS:
      return {...state, projects: action.status}
    case SET_TASKS_STATUS:
      return {...state, tasks: action.status}
    case SET_ATTACHMENTS_STATUS:
      return {...state, attachments: action.status}
    case SET_COMMENTS_STATUS:
      return {...state, comments: action.status}
    case SET_HISTORY_STATUS:
      return {...state, history: action.status}
    default:
      return state
  }
}

export default statusReducer;
