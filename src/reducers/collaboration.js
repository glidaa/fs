import { SET_SESSION, JOIN_PROEJCT, LEAVE_PROJECT, FOCUS_TASK, UNFOCUS_TASK, SET_TXT_CURSOR, RESET_COLLAB_DATA } from "../actions/collaboration"

const initState = {
  session: null,
  projectViewers: [],
  taskViewers: {}
}

export default function (state = initState, action) {
  switch(action.type) {
    case SET_SESSION:
      return {...state, session: action.session}
    case JOIN_PROEJCT:
      return {...state, projectViewers: [...new Set([ action.username, ...state.projectViewers ])]}
    case LEAVE_PROJECT:
      state.projectViewers.splice(state.projectViewers.indexOf(action.username), 1)
      for (const taskID in state.taskViewers) {
        if (state.taskViewers[taskID].includes(action.username)) {
          state.taskViewers[taskID] = state.taskViewers[taskID].filter(user => user !== action.username)
        }
        if (state.taskViewers[taskID]?.length === 0) {
          delete state.taskViewers[taskID]
        }
      }
      return {...state}
    case FOCUS_TASK:
      for (const taskID in state.taskViewers) {
        if (state.taskViewers[taskID].includes(action.username)) {
          state.taskViewers[taskID].splice(state.taskViewers[taskID].indexOf(action.username), 1)
          if (state.taskViewers[taskID]?.length === 0) {
            delete state.taskViewers[taskID]
          }
        }
      }
      return {
        ...state,
        taskViewers: {
          ...state.taskViewers,
          [action.taskID]: [...new Set([ ...(state.taskViewers[action.taskID] || []), action.username])]
        }
      }
    case UNFOCUS_TASK:
      state.taskViewers[action.taskID]?.splice(state.taskViewers[action.taskID].indexOf(action.username), 1)
      if (state.taskViewers[action.taskID]?.length === 0) {
        delete state.taskViewers[action.taskID]
      }
      return {...state}
    case SET_TXT_CURSOR:
      return {...state}
    case RESET_COLLAB_DATA:
      return {
        ...state,
        projectViewers: [],
        taskViewers: {}
      }
    default:
      return state
  }
}