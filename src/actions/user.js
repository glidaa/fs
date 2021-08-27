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
    const { firstName, lastName } = userData
    const abbr = firstName[0].toUpperCase() + lastName[0].toUpperCase()
    dispatch(setData({...userData, abbr}))
  } else {
    dispatch(setData(null))
  }
}