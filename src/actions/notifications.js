import { API, graphqlOperation } from "@aws-amplify/api";
import { AuthState } from '../constants';
import * as usersActions from './users';
import { listNotifications } from "../graphql/queries"

export const ADD_NOTIFICATION = "ADD_NOTIFICATION";
export const PUSH_NOTIFICATION = "PUSH_NOTIFICATION";
export const DISMISS_NOTIFICATION = "DISMISS_NOTIFICATION";
export const REMOVE_NOTIFICATION = "REMOVE_NOTIFICATION";
export const FETCH_NOTIFICATIONS = "FETCH_NOTIFICATIONS";

export const add = (notification) => ({
  type: ADD_NOTIFICATION,
  notification
})

export const push = (notification) => ({
  type: PUSH_NOTIFICATION,
  notification
})

export const dismiss = (id) => ({
  type: DISMISS_NOTIFICATION,
  id
})

export const remove = (id) => ({
  type: REMOVE_NOTIFICATION,
  id
})

const fetchNotifications = (notifications) => ({
  type: FETCH_NOTIFICATIONS,
  notifications
});

export const handleFetchNotifications = (taskID) => async (dispatch, getState) => {
  const { user } = getState()
  if (user.state === AuthState.SignedIn) {
    try {
      const res = await API.graphql(graphqlOperation(listNotifications, { taskID }))
      const items = res.data.listNotifications.items;
      let usersToBeFetched = []
      for (const item of items) {
        usersToBeFetched = [...new Set([
          ...usersToBeFetched,
          item.sender
        ])]
      }
      await dispatch(usersActions.handleAddUsers(usersToBeFetched))
      dispatch(fetchNotifications(items))
    } catch (err) {
      console.error(err)
    }
  }
}