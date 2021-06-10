import { ADD_USER } from "../actions/users"

export default function (state = {}, action) {
  switch(action.type) {
    case ADD_USER:
      return {...state, [action.username]: action.name}
    default:
      return state
  }
}