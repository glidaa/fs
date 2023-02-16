import API from "../amplify/API";
import { listUsersByUsernames, searchUserToWatch, searchUserToAssign } from "../graphql/queries"
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
  const { users, app } = getState()
  if (!app.isOffline) {
    usernames = usernames.filter(x => !users[x])
    const res = await API.execute(listUsersByUsernames, { usernames })
    const items = res.data.listUsersByUsernames.items
    const itemsWithAbbr = items.map(x => {
      const initials = x.firstName[0].toUpperCase() + x.lastName[0].toUpperCase()
      return { ...x, initials }
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
}

export const handleSearchUsers = (keyword, taskId, purpose = "toAssign") => async (dispatch, getState) => {
  const { users, app } = getState()
  if (!app.isOffline) {
    keyword = keyword.replace(/\s\s+/g, ' ').trim()
    try {
      const usersData =
        purpose === "toAssign"
        ? (await API.execute(searchUserToAssign, { searchQuery: keyword, taskId })).data.searchUserToAssign.items || []
        : (await API.execute(searchUserToWatch, { searchQuery: keyword, taskId })).data.searchUserToWatch.items || []
      const newUsersData = usersData.filter(x => !users[x.username])
      const itemsWithAbbr = newUsersData.map(x => {
        const initials = x.firstName[0].toUpperCase() + x.lastName[0].toUpperCase()
        return { ...x, initials }
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
  } else {
    const { tasks } = getState();
    let currentUsers = purpose === "toAssign"
      ? tasks[taskId].assignees
      : purpose === "toWatch"
      ? tasks[taskId].watchers
      : [];
    return users
      .map(x => x.username)
      .filter(x => !currentUsers.includes(x))
      .sort();
  }
}