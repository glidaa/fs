import { CREATE_HISTORY, EMPTY_HISTORY, FETCH_HISTORY, FETCH_CACHED_HISTORY } from "../actions/history"

const historyReducer = (state = [], action) => {
  let stateClone = [...state]
  switch(action.type) {
    case CREATE_HISTORY:
      stateClone.push(action.historyState)
      stateClone.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
      return stateClone
    case EMPTY_HISTORY:
      return []
    case FETCH_HISTORY:
      return action.history
    case FETCH_CACHED_HISTORY:
      return action.history
    default:
      return state
  }
}

export default historyReducer;
