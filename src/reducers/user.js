import { AuthState } from '@aws-amplify/ui-components';
import { SET_STATE, SET_DATA } from "../actions/user"

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
    default:
      return state
  }
}