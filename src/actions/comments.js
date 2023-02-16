import { AuthState, ThingStatus } from '../constants';
import { listCommentsForTask } from "../graphql/queries"
import * as statusActions from "./status"
import * as usersActions from "./users"
import * as cacheController from "../controllers/cache"
import API from '../amplify/API';

export const CREATE_COMMENT = "CREATE_COMMENT";
export const UPDATE_COMMENT = "UPDATE_COMMENT";
export const REMOVE_COMMENT = "REMOVE_COMMENT";
export const EMPTY_COMMENTS = "EMPTY_COMMENTS";
export const FETCH_COMMENTS = "FETCH_COMMENTS";
export const FETCH_CACHED_COMMENTS = "FETCH_CACHED_COMMENTS";

export const createComment = (commentState) => ({
  type: CREATE_COMMENT,
  commentState
});

export const updateComment = (update) => ({
  type: UPDATE_COMMENT,
  update
});

export const removeComment = (id) => ({
  type: REMOVE_COMMENT,
  id
});

export const emptyComments = () => ({
  type: EMPTY_COMMENTS
});

const fetchComments = (comments, taskId) => ({
  type: FETCH_COMMENTS,
  comments,
  taskId
});

const fetchCachedComments = (comments) => ({
  type: FETCH_CACHED_COMMENTS,
  comments
});

export const handleCreateComment = (commentState) => (dispatch, getState) => {
  const { user } = getState()
  if (user.state === AuthState.SignedIn) {
    dispatch(createComment({
      ...commentState,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: user.data.username,
      isVirtual: true
    }))
    API.mutate({
      type: "createComment",
      variables: commentState,
      success: (incoming) => {
        dispatch(updateComment({
          id: incoming.data.createComment.id,
          isVirtual: false
        }))
      },
      error: () => {
        dispatch(removeComment(commentState.id))
      }
    })
  }
}

export const handleUpdateComment = (update) => (dispatch, getState) => {
  const { user, comments } = getState()
  const prevCommentState = {...comments[update.id]}
  if (user.state === AuthState.SignedIn) {
    if (comments[update.id]) {
      dispatch(updateComment(update))
    }
    return API.mutate({
      type: "updateComment",
      variables: update,
      success: null,
      error: () => {
        if (getState().comments[update.id]) {
          dispatch(updateComment(prevCommentState))
        }
      }
    })
  }
}

export const handleRemoveComment = (commentState) => (dispatch, getState) => {
  const { user, comments } = getState()
  if (user.state === AuthState.SignedIn) {
    if (comments[commentState.id]) {
      dispatch(removeComment(commentState.id))
    }
    return API.mutate({
      type: "deleteComment",
      variables: { id: commentState.id },
      success: null,
      error: () => {
        if (getState().app.selectedTask === commentState.taskId) {
          dispatch(createComment(commentState))
        }
      }
    })
  }
}

export const handleFetchComments = (taskId) => async (dispatch, getState) => {
  dispatch(statusActions.setCommentsStatus(ThingStatus.FETCHING))
  const { user, app, projects } = getState()
  if (user.state === AuthState.SignedIn || projects[app.selectedProject].isTemp) {
    try {
      const res = await API.execute(listCommentsForTask, { taskId })
      const items = res.data.listCommentsForTask.items;
      let usersToBeFetched = []
      for (const item of items) {
        usersToBeFetched = [...new Set([
          ...usersToBeFetched,
          item.owner
        ])]
      }
      await dispatch(usersActions.handleAddUsers(usersToBeFetched))
      dispatch(fetchComments(items, taskId))
      dispatch(statusActions.setCommentsStatus(ThingStatus.READY))
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        dispatch(fetchCachedComments(cacheController.getCommentsByTaskId(taskId)))
        dispatch(statusActions.setCommentsStatus(ThingStatus.READY))
      } else {
        dispatch(statusActions.setCommentsStatus(ThingStatus.ERROR))
      }
    }
    return getState().comments
  }
}