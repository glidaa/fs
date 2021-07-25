import {
  SET_PROJECTS_OBSERVERS,
  CLEAR_PROJECTS_OBSERVERS,
  SET_TASKS_OBSERVERS,
  CLEAR_TASKS_OBSERVERS,
  SET_COMMENTS_OBSERVERS,
  CLEAR_COMMENTS_OBSERVERS,
} from "../actions/observers"

const initState = {
  projects: null,
  tasks: null,
  comments: null
}

export default function (state = initState, action) {
  switch(action.type) {
    case SET_PROJECTS_OBSERVERS:
      return {...state, projects: action.observers}
    case CLEAR_PROJECTS_OBSERVERS:
      return {...state, projects: null}
    case SET_TASKS_OBSERVERS:
      return {...state, tasks: action.observers}
    case CLEAR_TASKS_OBSERVERS:
      return {...state, tasks: null}
    case SET_COMMENTS_OBSERVERS:
      return {...state, comments: action.observers}
    case CLEAR_COMMENTS_OBSERVERS:
      return {...state, comments: null}
    default:
      return state
  }
}