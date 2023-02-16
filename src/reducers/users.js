import { ADD_CACHED_USERS, ADD_USERS } from "../actions/users"

const usersReducer = (state = {}, action) => {
  const stateClone = {...state}
  switch(action.type) {
    case ADD_USERS:
      for (const { username, ...userData } of action.users) {
        stateClone[username] = userData
      }
      return stateClone
    case ADD_CACHED_USERS:
      return action.users
    default:
      return state
  }
}

export default usersReducer;
