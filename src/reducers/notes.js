import injectItemOrder from "../utils/injectItemOrder"
import removeItemOrder from "../utils/removeItemOrder"
import { CREATE_NOTE, UPDATE_NOTE, REMOVE_NOTE, EMPTY_NOTES, FETCH_NOTES } from "../actions/notes"

export default function (state = {}, action) {
  let stateClone = {...state}
  switch(action.type) {
    case CREATE_NOTE:
      stateClone = injectItemOrder(
        stateClone,
        action.noteState,
        action.noteState.prevNote,
        action.noteState.nextNote,
        "prevNote",
        "nextNote"
      )
      return {...stateClone, [action.noteState.id]: action.noteState}
    case UPDATE_NOTE:
      const { update } = action
      if (update.prevNote !== undefined && update.nextNote !== undefined) {
        stateClone = removeItemOrder(
          stateClone,
          stateClone[update.id],
          "prevNote",
          "nextNote"
        )
        stateClone = injectItemOrder(
          stateClone,
          stateClone[update.id],
          update.prevNote,
          update.nextNote,
          "prevNote",
          "nextNote"
        )
      }
      return {
        ...stateClone,
        [update.id]: {
          ...stateClone[update.id],
          ...update
        }}
    case REMOVE_NOTE:
      stateClone = removeItemOrder(
        stateClone,
        stateClone[action.id],
        "prevNote",
        "nextNote"
      )
      delete stateClone[action.id]
      return stateClone
    case EMPTY_NOTES:
      return {}
    case FETCH_NOTES:
      const newState = {}
      for (const note of action.notes) {
        newState[note.id] = note
      }
      return newState
    default:
      return state
  }
}