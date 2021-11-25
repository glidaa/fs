import {
  SET_USER_OBSERVERS,
  CLEAR_USER_OBSERVERS,
  SET_OWNED_PROJECTS_OBSERVERS,
  CLEAR_OWNED_PROJECTS_OBSERVERS,
  SET_PROJECT_OBSERVERS,
  CLEAR_PROJECT_OBSERVERS,
  SET_TASKS_OBSERVERS,
  CLEAR_TASKS_OBSERVERS,
  SET_COMMENTS_OBSERVERS,
  CLEAR_COMMENTS_OBSERVERS,
  SET_NOTIFICATIONS_OBSERVERS,
  CLEAR_NOTIFICATIONS_OBSERVERS,
} from "../actions/observers"

const initState = {
  projects: {
    owned: null,
    others: {}
  },
  tasks: null,
  comments: null,
  notifications: null,
  user: null
}

export default function (state = initState, action) {
  const stateClone = {...state}
  switch(action.type) {
    case SET_USER_OBSERVERS:
      return {...state, user: action.observers}
    case CLEAR_USER_OBSERVERS:
      return {...state, user: null}
    case SET_OWNED_PROJECTS_OBSERVERS:
      stateClone.projects.owned = action.observers
      return stateClone
    case CLEAR_OWNED_PROJECTS_OBSERVERS:
      stateClone.projects.owned = null
      return stateClone
    case SET_PROJECT_OBSERVERS:
      stateClone.projects.others[action.id] = action.observers
      return stateClone
    case CLEAR_PROJECT_OBSERVERS:
      delete stateClone.projects.others[action.id]
      return stateClone
    case SET_TASKS_OBSERVERS:
      return {...state, tasks: action.observers}
    case CLEAR_TASKS_OBSERVERS:
      return {...state, tasks: null}
    case SET_COMMENTS_OBSERVERS:
      return {...state, comments: action.observers}
    case CLEAR_COMMENTS_OBSERVERS:
      return {...state, comments: null}
    case SET_NOTIFICATIONS_OBSERVERS:
      return {...state, notifications: action.observers}
    case CLEAR_NOTIFICATIONS_OBSERVERS:
      return {...state, notifications: null}
    default:
      return state
  }
}