import { API, Auth } from "aws-amplify";

export const ADD_USER = "ADD_USER";

export const addUser = (username, name) => ({
  type: ADD_USER,
  username,
  name
});

const getUserName = async (username) => {
  let firstName = ""
  let lastName = ""
  const queryData = { 
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
    },
    queryStringParameters: {
        username: username,
    },
  };
  const data = await API.get("AdminQueries", "/getUser", queryData)
  for (const entry of data.UserAttributes) {
    if (entry.Name === "given_name") {
      firstName = entry.Value
    } else if (entry.Name === "family_name") {
      lastName = entry.Value
    }
  }
  return `${firstName} ${lastName}`
}

export const handleAddUser = (username) => (dispatch, getState) => {
  const { users } = getState()
  if (users[username] === undefined) {
    dispatch(addUser(username, null))
    getUserName(username).then((name) => {
      return dispatch(addUser(username, name))
    })
  }
}