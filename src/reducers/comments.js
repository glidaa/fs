import { CREATE_COMMENT, UPDATE_COMMENT, REMOVE_COMMENT, EMPTY_COMMENTS, FETCH_COMMENTS, FETCH_CACHED_COMMENTS } from "../actions/comments"

export default function (state = {}, action) {
  switch(action.type) {
    case CREATE_COMMENT:
      return {...state, [action.commentState.id]: action.commentState}
    case UPDATE_COMMENT:
      const { update } = action
      return {
        ...state,
        [update.id]: {
          ...state[update.id],
          ...update
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
    case FETCH_CACHED_COMMENTS:
      return action.comments
    default:
      return state
  }
}