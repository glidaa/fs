import { ADD_NOTIFICATION, PUSH_NOTIFICATION, DISMISS_NOTIFICATION, REMOVE_NOTIFICATION, FETCH_NOTIFICATIONS, EMPTY_NOTIFICATIONS } from "../actions/notifications"

const initState = {
  stored: [],
  pushed: []
}

export default function (state = initState, action) {
  switch(action.type) {
    case ADD_NOTIFICATION:
      action.notification.payload = JSON.parse(action.notification.payload)
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
      const newStored = []
      for (const notification of action.notifications) {
        notification.payload = JSON.parse(notification.payload)
        newStored.push(notification)
      }
      return {
        ...state,
        stored: newStored.sort((a, b) => b.createdAt - a.createdAt)
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