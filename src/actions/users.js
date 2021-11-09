import { API, graphqlOperation } from "@aws-amplify/api";
import { listUsersByUsernames } from "../graphql/queries"
import getGravatar from '../utils/getGravatar';

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
  });
  (async ([...itemsWithAvatar], dispatch) => {
    let shouldDispatch = false
    for (const x of itemsWithAvatar) {
      if (!x.avatar) {
        shouldDispatch = true
        x.avatar = await getGravatar(x.email)
      }
    }
    if (shouldDispatch) {
      dispatch(addUsers({...itemsWithAvatar}))
    }
  })(itemsWithAbbr, dispatch)
  return dispatch(addUsers(itemsWithAbbr))
}