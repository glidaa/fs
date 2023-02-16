import { CREATE_ATTACHMENT, EMPTY_ATTACHMENTS, FETCH_ATTACHMENTS, FETCH_CACHED_ATTACHMENTS } from "../actions/attachments"

const attachmentsReducer = (state = [], action) => {
  let stateClone = [...state]
  switch(action.type) {
    case CREATE_ATTACHMENT:
      stateClone.push(action.attachmentState)
      stateClone.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
      return stateClone
    case EMPTY_ATTACHMENTS:
      return []
    case FETCH_ATTACHMENTS:
      return action.attachments
    case FETCH_CACHED_ATTACHMENTS:
      return action.attachments
    default:
      return state
  }
}

export default attachmentsReducer;
