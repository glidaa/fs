import { API, graphqlOperation } from "@aws-amplify/api";
import { AuthState } from '../constants';
import { listNotifications } from "../graphql/queries"

export const PUSH_NOTIFICATION = "PUSH_NOTIFICATION";
export const DISMISS_NOTIFICATION = "DISMISS_NOTIFICATION";
export const FETCH_NOTIFICATIONS = "FETCH_NOTIFICATIONS";

export const push = (id) => ({
  type: PUSH_NOTIFICATION,
  id
})

export const dismiss = (id) => ({
  type: DISMISS_NOTIFICATION,
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
          item.owner
        ])]
      }
      dispatch(fetchNotifications(items))
    } catch (err) {
      console.error(err)
    }
  }
}