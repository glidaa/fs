import { API, graphqlOperation } from "aws-amplify";
import { AuthState } from '@aws-amplify/ui-components';
import { listCommentsForTask } from "../graphql/queries"
import * as mutations from "../graphql/mutations"
import * as usersActions from "./users"
import * as mutationsActions from "./mutations"
import generateMutationID from "../utils/generateMutationID";

export const CREATE_COMMENT = "CREATE_COMMENT";
export const UPDATE_COMMENT = "UPDATE_COMMENT";
export const REMOVE_COMMENT = "REMOVE_COMMENT";
export const EMPTY_COMMENTS = "EMPTY_COMMENTS";
export const FETCH_COMMENTS = "FETCH_COMMENTS";

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

const fetchComments = (comments) => ({
  type: FETCH_COMMENTS,
  comments
});

export const handleCreateComment = (commentState) => (dispatch, getState) => {
  const { user } = getState()
  if (user.state === AuthState.SignedIn) {
    return API.graphql(graphqlOperation(mutations.createComment, { input: commentState }))
      .catch((err) => {
        console.error(err)
      })
  }
}

export const handleUpdateComment = (update) => (dispatch, getState) => {
  const { user, comments } = getState()
  const prevCommentState = {...comments[update.id]}
  const updateWithID = {id: prevCommentState.id, ...update };
  if (user.state === AuthState.SignedIn) {
    const mutationID = generateMutationID(user.data.username)
    dispatch(mutationsActions.addMutation(mutationID))
    if (comments[prevCommentState.id]) {
      dispatch(updateComment(updateWithID))
    }
    return API.graphql(graphqlOperation(mutations.updateComment, { input: { ...updateWithID, mutationID } }))
      .catch((err) => {
        console.error(err)
        if (comments[prevCommentState.id]) {
          return dispatch(updateComment(prevCommentState))
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
    return API.graphql(graphqlOperation(mutations.deleteComment, { commentID: commentState.id }))
      .catch((err) => {
        console.error(err)
        if (comments[commentState.id]) {
          dispatch(createComment(commentState))
        }
      })
  }
}

export const handleFetchComments = (taskID) => async (dispatch, getState) => {
  const { user } = getState()
  if (user.state === AuthState.SignedIn) {
    try {
      const res = await API.graphql(graphqlOperation(listCommentsForTask, { taskID }))
      const items = res.data.listCommentsForTask.items;
      let usersToBeFetched = []
      for (const item of items) {
        usersToBeFetched = [...new Set([
          ...usersToBeFetched,
          item.owner
        ])]
      }
      await dispatch(usersActions.handleAddUsers(usersToBeFetched))
      dispatch(fetchComments(items))
    } catch (err) {
      console.error(err)
    }
  }
}