import { PUSH_NOTIFICATION, DISMISS_NOTIFICATION } from "../actions/notifications"

const initState = {
  stored: {
    "1": {
      id: 1,
      type: "assignment",
      payload: {
        assigner: "Jerry",
        link: "/GeeekyBoy/overflows-reactions/6"
      }
    },
    "2": {
      id: 2,
      type: "assignment",
      payload: {
        assigner: "GeeekyBoy",
        link: "/GeeekyBoy/overflows-reactions/6"
      }
    }
  },
  pushed: []
}

export default function (state = initState, action) {
  switch(action.type) {
    case PUSH_NOTIFICATION:
      return {
        ...state,
        pushed: [
          ...new Set([
            ...state.pushed,
            action.id
          ])
        ]
      }
    case DISMISS_NOTIFICATION:
      return {
        ...state,
        pushed: state.pushed.filter(x => x !== action.id)
      }
    default:
      return state
  }
}