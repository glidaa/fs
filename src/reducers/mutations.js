import { ADD_MUTATION, REMOVE_MUTATION } from "../actions/users"

export default function (state = [], action) {
  switch(action.type) {
    case ADD_MUTATION:
      return [...new Set([...state, action.mutation])]
    case REMOVE_MUTATION:
        return [...state].filter(x => x !== action.mutation)
    default:
      return state
  }
}