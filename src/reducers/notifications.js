import { PUSH_NOTIFICATION, DISMISS_NOTIFICATION } from "../actions/notifications"

export default function (state = [{id: "1", title: "Title", body:"Body"}], action) {
  switch(action.type) {
    case PUSH_NOTIFICATION:
      return [...new Set([...state, action.id])]
    case DISMISS_NOTIFICATION:
        return state.filter(x => x !== action.id)
    default:
      return state
  }
}