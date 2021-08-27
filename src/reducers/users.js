import { ADD_USERS } from "../actions/users"

export default function (state = {}, action) {
  const stateClone = {...state}
  switch(action.type) {
    case ADD_USERS:
      for (const { username, ...userData } of action.users) {
        stateClone[username] = userData
      }
      return stateClone
    default:
      return state
  }
}