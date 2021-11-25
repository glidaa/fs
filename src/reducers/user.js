import { AuthState } from '../constants';
import { SET_STATE, SET_DATA, FETCH_CACHED_USER } from "../actions/user"

const initState = {
  state: AuthState.SignedOut,
  data: null
}

export default function (state = initState, action) {
  switch(action.type) {
    case SET_STATE:
      return {...state, state: action.userSate}
    case SET_DATA:
      return {...state, data: action.userData}
    case FETCH_CACHED_USER:
      return action.user
    default:
      return state
  }
}