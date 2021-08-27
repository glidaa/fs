import { API, graphqlOperation } from "aws-amplify";
import { listUsersByUsernames } from "../graphql/queries"

export const ADD_USERS = "ADD_USERS";

export const addUsers = (users) => ({
  type: ADD_USERS,
  users
});

export const handleAddUsers = (usernames) => async (dispatch, getState) => {
  const { users } = getState()
  usernames = usernames.filter(x => !users[x])
  const res = await API.graphql(graphqlOperation(listUsersByUsernames, { usernames }))
  const items = res.data.listUsersByUsernames.items
  const itemsWithAbbr = items.map(x => {
    const abbr = x.firstName[0].toUpperCase() + x.lastName[0].toUpperCase()
    return { ...x, abbr }
  })
  return dispatch(addUsers(itemsWithAbbr))
}