import { CREATE_COMMENT, UPDATE_COMMENT, REMOVE_COMMENT, EMPTY_COMMENTS, FETCH_COMMENTS } from "../actions/comments"

export default function (state = {}, action) {
  switch(action.type) {
    case CREATE_COMMENT:
      return {...state, [action.commentState.id]: action.commentState}
    case UPDATE_COMMENT:
      return {
        ...state,
        [action.update.id]: {
          ...state[action.update.id],
          ...action.update
        }}
    case REMOVE_COMMENT:
      const stateClone = {...state}
      delete stateClone[action.id]
      return stateClone
    case EMPTY_COMMENTS:
      return {}
    case FETCH_COMMENTS:
      const newState = {}
      for (const comment of action.comments) {
        newState[comment.id] = comment
      }
      return newState
    default:
      return state
  }
}