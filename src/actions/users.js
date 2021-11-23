import { graphqlOperation } from "@aws-amplify/api";
import { listUsersByUsernames } from "../graphql/queries"
import execGraphQL from "../utils/execGraphQL";
import generateRandomColor from "../utils/generateRandomColor";
import getGravatar from '../utils/getGravatar';

export const ADD_USERS = "ADD_USERS";
export const ADD_CACHED_USERS = "ADD_CACHED_USERS";

export const addUsers = (users) => ({
  type: ADD_USERS,
  users
});

export const addCachedUsers = (users) => ({
  type: ADD_CACHED_USERS,
  users
});

export const handleAddUsers = (usernames) => async (dispatch, getState) => {
  const { users } = getState()
  usernames = usernames.filter(x => !users[x])
  const res = await execGraphQL(graphqlOperation(listUsersByUsernames, { usernames }))
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
        x.color = generateRandomColor({ l: 50 })
      }
    }
    if (shouldDispatch) {
      dispatch(addUsers([...itemsWithAvatar]))
    }
  })(itemsWithAbbr, dispatch)
  return dispatch(addUsers(itemsWithAbbr))
}

export const handleSearchUsers = (keyword) => async (dispatch, getState) => {
  const { users } = getState()
  const firstLastName = keyword.split(/\s+/)
  const query = `
    query SearchUsers($filter: SearchableUserFilterInput!) {
      searchUsers(filter: $filter) {
        items {
          username
          firstName
          lastName
          email
          avatar
        }
      }
    }
  `
  const filter = {or: [
    { username: { matchPhrasePrefix: keyword } },
    ...((firstLastName.length !== 2 && [{
      firstName: { matchPhrasePrefix: keyword }
    }]) || []),
    ...((firstLastName.length === 2 && [{
      and: [
        { firstName: { matchPhrasePrefix: firstLastName[0] } },
        { lastName: { matchPhrasePrefix: firstLastName[1] } },
      ]
    }]) || []),
    { email: { matchPhrasePrefix: keyword } }
  ]}
  try {
    const usersData = (await execGraphQL(graphqlOperation(query, { filter }))).data.searchUsers.items || []
    const newUsersData = usersData.filter(x => !users[x.username])
    const itemsWithAbbr = newUsersData.map(x => {
      const abbr = x.firstName[0].toUpperCase() + x.lastName[0].toUpperCase()
      return { ...x, abbr }
    });
    (async ([...itemsWithAvatar], dispatch) => {
      let shouldDispatch = false
      for (const x of itemsWithAvatar) {
        if (!x.avatar) {
          shouldDispatch = true
          x.avatar = await getGravatar(x.email)
          x.color = generateRandomColor({ l: 50 })
        }
      }
      if (shouldDispatch) {
        dispatch(addUsers([...itemsWithAvatar]))
      }
    })(itemsWithAbbr, dispatch)
    dispatch(addUsers(itemsWithAbbr))
    return usersData.map(x => x.username).sort()
  } catch {
    return []
  }
}