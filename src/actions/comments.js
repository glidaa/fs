import { API, graphqlOperation } from "aws-amplify";
import { AuthState } from '@aws-amplify/ui-components';
import { listCommentsForNote } from "../graphql/queries"
import * as mutations from "../graphql/mutations"
import * as usersActions from "./users"

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
    if (commentState.noteID === getState().app.selectedNote) {
      dispatch(createComment(commentState))
    }
    return API.graphql(graphqlOperation(mutations.createComment, { input: commentState }))
      .catch(() => {
        if (commentState.noteID === getState().app.selectedNote) {
          return dispatch(removeComment(commentState.id))
        }
      })
  }
}

export const handleUpdateComment = (update) => (dispatch, getState) => {
  const { user, comments } = getState()
  const prevCommentState = {...comments[update.id]}
  const updateWithID = {id: prevCommentState.id, ...update };
  if (user.state === AuthState.SignedIn) {
    if (comments[prevCommentState.id]) {
      dispatch(updateComment(updateWithID))
    }
    return API.graphql(graphqlOperation(mutations.updateComment, { input: updateWithID }))
      .catch(() => {
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
      .catch(() => {
        if (comments[commentState.id]) {
          dispatch(createComment(commentState))
        }
      })
  }
}

export const handleFetchComments = (noteID) => (dispatch, getState) => {
  const { user } = getState()
  if (user.state === AuthState.SignedIn) {
    return API.graphql(graphqlOperation(listCommentsForNote, { noteID }))
      .then(e => {
        const result = e.data.listCommentsForNote.items;
        for (const item of result) {
          dispatch(usersActions.handleAddUser(item.owner))
        }
        dispatch(fetchComments(e.data.listCommentsForNote.items))
      })
      .catch(e => console.error(e))
  }
}