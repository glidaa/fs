import { ADD_NOTIFICATION, PUSH_NOTIFICATION, DISMISS_NOTIFICATION, REMOVE_NOTIFICATION, FETCH_NOTIFICATIONS, EMPTY_NOTIFICATIONS } from "../actions/notifications"

const initState = {
  stored: [],
  pushed: []
}

const notificationsReducer = (state = initState, action) => {
  switch(action.type) {
    case ADD_NOTIFICATION:
      return {
        ...state,
        stored: [
          action.notification,
          ...state.stored
        ]
      }
    case PUSH_NOTIFICATION:
      return {
        ...state,
        pushed: [
          action.notification,
          ...state.pushed
        ]
      }
    case DISMISS_NOTIFICATION:
      return {
        ...state,
        pushed: state.pushed.filter(x => x.id !== action.id)
      }
    case REMOVE_NOTIFICATION:
      return {
        ...state,
        stored: state.stored.filter(x => x.id !== action.id)
      }
    case FETCH_NOTIFICATIONS:
      return {
        ...state,
        stored: action.notifications.sort((a, b) => b.createdAt - a.createdAt)
      }
    case EMPTY_NOTIFICATIONS:
      return {
        ...state,
        stored: []
      }
    default:
      return state
  }
}

export default notificationsReducer;
