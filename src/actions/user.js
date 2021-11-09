import { AuthState } from '../constants';
import getGravatar from '../utils/getGravatar';
import * as observersActions from "./observers"
import * as notificationsActions from "./notifications"

export const SET_STATE = "SET_STATE";
export const SET_DATA = "SET_DATA";

const setState = (userSate) => ({
  type: SET_STATE,
  userSate
});

const setData = (userData) => ({
  type: SET_DATA,
  userData
});

export const handleSetState = (userState) => (dispatch) => {
  if (userState !== AuthState.SignedIn) {
    dispatch(observersActions.handleClearUserObservers())
  }
  dispatch(setState(userState))
  if (userState === AuthState.SignedIn) {
    dispatch(observersActions.handleSetUserObservers())
    dispatch(notificationsActions.handleFetchNotifications())
    dispatch(observersActions.handleSetNotificationsObservers())
  }
}

export const handleSetData = (userData) => (dispatch) => {
  if (userData) {
    const { firstName, lastName } = userData
    const abbr = firstName[0].toUpperCase() + lastName[0].toUpperCase()
    dispatch(setData({...userData, abbr}))
    if (!userData.avatar) {
      getGravatar(userData.email).then((avatar) => {
        dispatch(setData({...userData, avatar}))
      })
    }
  } else {
    dispatch(setData(null))
  }
}