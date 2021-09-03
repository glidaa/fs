import { ADD_MUTATION, REMOVE_MUTATION } from "../actions/mutations"

export default function (state = [], action) {
  const stateClone = [...state]
  if (stateClone.length >= 100) stateClone.shift()
  switch(action.type) {
    case ADD_MUTATION:
      return [...new Set([...stateClone, action.mutation])]
    case REMOVE_MUTATION:
        return stateClone.filter(x => x !== action.mutation)
    default:
      return state
  }
}