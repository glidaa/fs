import { AuthState, ThingStatus } from '../constants';
import * as usersActions from './users';
import * as statusActions from "./status"
import { listNotifications } from "../graphql/queries"
import * as cacheController from "../controllers/cache"
import API from '../amplify/API';

export const ADD_NOTIFICATION = "ADD_NOTIFICATION";
export const PUSH_NOTIFICATION = "PUSH_NOTIFICATION";
export const DISMISS_NOTIFICATION = "DISMISS_NOTIFICATION";
export const REMOVE_NOTIFICATION = "REMOVE_NOTIFICATION";
export const FETCH_NOTIFICATIONS = "FETCH_NOTIFICATIONS";
export const EMPTY_NOTIFICATIONS = "EMPTY_NOTIFICATIONS";

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

export const emptyNotifications = (id) => ({
  type: EMPTY_NOTIFICATIONS,
  id
})

const fetchNotifications = (notifications) => ({
  type: FETCH_NOTIFICATIONS,
  notifications
});

export const handleFetchNotifications = () => async (dispatch, getState) => {
  dispatch(statusActions.setNotificationsStatus(ThingStatus.FETCHING))
  const { user } = getState()
  if (user.state === AuthState.SignedIn) {
    try {
      const res = await API.execute(listNotifications)
      const items = res.data.listNotifications.items;
      let usersToBeFetched = []
      for (const item of items) {
        usersToBeFetched = [...new Set([
          ...usersToBeFetched,
          item.mutator,
        ])]
      }
      await dispatch(usersActions.handleAddUsers(usersToBeFetched))
      dispatch(fetchNotifications(items))
      dispatch(statusActions.setNotificationsStatus(ThingStatus.READY))
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        dispatch(fetchNotifications(cacheController.getNotifications()))
        dispatch(statusActions.setNotificationsStatus(ThingStatus.READY))
      } else {
        dispatch(statusActions.setNotificationsStatus(ThingStatus.ERROR))
      }
    }
  }
}