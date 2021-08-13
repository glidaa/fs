import * as usersActions from "./users"

export const SET_STATE = "SET_STATE";
export const SET_DATA = "SET_DATA";

export const setState = (userSate) => ({
  type: SET_STATE,
  userSate
});

const setData = (userData) => ({
  type: SET_DATA,
  userData
});

export const handleSetData = (userData) => (dispatch) => {
  if (userData) {
    const firstName = userData.attributes.given_name
    const lastName = userData.attributes.family_name
    const username = userData.username
    const name = `${firstName} ${lastName}`
    // dispatch(usersActions.addUser(username, name))
    dispatch(setData(userData))
  } else {
    dispatch(setData(null))
  }
}