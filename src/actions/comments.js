import { graphqlOperation } from "@aws-amplify/api";
import { AuthState } from '../constants';
import { listCommentsForTask } from "../graphql/queries"
import * as usersActions from "./users"
import * as mutationsActions from "./mutations"
import * as cacheController from "../controllers/cache"
import execGraphQL from "../utils/execGraphQL";

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

const fetchComments = (comments, taskID) => ({
  type: FETCH_COMMENTS,
  comments,
  taskID
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
    dispatch(mutationsActions.scheduleMutation(
      "createComment",
      commentState,
      (incoming) => {
        dispatch(updateComment({
          ...incoming.data.createComment,
          isVirtual: false
        }))
      },
      () => {
        dispatch(removeComment(commentState.id))
      }
    ))
  }
}

export const handleUpdateComment = (update) => (dispatch, getState) => {
  const { user, comments } = getState()
  const prevCommentState = {...comments[update.id]}
  if (user.state === AuthState.SignedIn) {
    if (comments[update.id]) {
      dispatch(updateComment(update))
    }
    return dispatch(mutationsActions.scheduleMutation(
      "updateComment",
      update,
      null,
      () => {
        if (getState().comments[update.id]) {
          dispatch(updateComment(prevCommentState))
        }
      }
    ))
  }
}

export const handleRemoveComment = (commentState) => (dispatch, getState) => {
  const { user, comments } = getState()
  if (user.state === AuthState.SignedIn) {
    if (comments[commentState.id]) {
      dispatch(removeComment(commentState.id))
    }
    return dispatch(mutationsActions.scheduleMutation(
      "deleteComment",
      { id: commentState.id },
      null,
      () => {
        if (getState().app.selectedTask === commentState.taskID) {
          dispatch(createComment(commentState))
        }
      }
    ))
  }
}

export const handleFetchComments = (taskID) => async (dispatch, getState) => {
  const { user } = getState()
  if (user.state === AuthState.SignedIn) {
    try {
      const res = await execGraphQL(graphqlOperation(listCommentsForTask, { taskID }))
      const items = res.data.listCommentsForTask.items;
      let usersToBeFetched = []
      for (const item of items) {
        usersToBeFetched = [...new Set([
          ...usersToBeFetched,
          item.owner
        ])]
      }
      await dispatch(usersActions.handleAddUsers(usersToBeFetched))
      dispatch(fetchComments(items, taskID))
    } catch (err) {
      if (err.errors[0].message === 'Network Error') {
        dispatch(fetchCachedComments(cacheController.getCommentsByTaskID(taskID)))
      }
    }
    return getState().comments
  }
}