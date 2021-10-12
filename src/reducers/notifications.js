import { PUSH_NOTIFICATION, DISMISS_NOTIFICATION } from "../actions/notifications"

const initState = []

export default function (state = initState, action) {
  switch(action.type) {
    case PUSH_NOTIFICATION:
      return [...new Set([...state, action.id])]
    case DISMISS_NOTIFICATION:
      return state.filter(x => x.id !== action.id)
    default:
      return state
  }
}