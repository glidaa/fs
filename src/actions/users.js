import { API, graphqlOperation } from "aws-amplify";
import { listUsersByUsernames } from "../graphql/queries"

export const ADD_USER = "ADD_USER";

export const addUsers = (users) => ({
  type: ADD_USER,
  users
});

export const handleAddUsers = (usernames, isAnonymousAllowed = true) => async (dispatch, getState) => {
  const { users } = getState()
  const res = await API.graphql(graphqlOperation(listUsersByUsernames, { usernames }))
  const items = res.data.listUsersByUsernames.items
  return dispatch(addUsers(items))
}