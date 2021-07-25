import React from 'react';
import { useOuterClick } from 'react-outer-click';
import { useState, useRef } from "react"
import { connect } from "react-redux";
import styledComponents from "styled-components";
import Avatar from "./Avatar"
import {stateToHTML} from 'draft-js-export-html';
import {Editor, EditorState, ContentState, convertToRaw, convertFromRaw} from 'draft-js';
import * as commentsActions from "../actions/comments";

const Comments = (props) => {
  const { user, users, comments, app, dispatch } = props
  const newCommentRef = useRef(null)
  const [isNewCommentOpened, setIsNewCommentOpened] = useState(false)
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );
  const openNewComment = () => {
    if (!isNewCommentOpened) {
      setIsNewCommentOpened(true);
    }
  }
  const submitComment = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const content = JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    dispatch(commentsActions.handleCreateComment({
      noteID: app.selectedNote,
      content: content
    }))
    setEditorState(EditorState.push(editorState, ContentState.createFromText('')))
    setIsNewCommentOpened(false);
  }
  useOuterClick(newCommentRef, () => {
    if (isNewCommentOpened) {
      setIsNewCommentOpened(false);
    }
  })
  return (
    <CommentsSection>
      {Object.values(comments).map(x => (
        users[x.owner] ? (
          <CommentUnit key={x.id}>
            <Avatar fullName={users[x.owner]} />
            <CommentContent>
              <CommentHeader>
                <div>
                  <span>{users[x.owner]}</span>
                  <span>{new Date(x.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span
                    onClick={() => (
                      x.owner === user.data.username &&
                      dispatch(commentsActions.handleRemoveComment(x)
                    ))}
                  >
                    ×
                  </span>
                </div>
              </CommentHeader>
              <CommentBody
                dangerouslySetInnerHTML={({
                  __html: stateToHTML(convertFromRaw(JSON.parse(x.content)))
                })}
              />
            </CommentContent>
          </CommentUnit>
        ) : null
      ))}
        <NewComment>
        <Avatar fullName={users[user.data.username]} />
          <CommentField onClick={openNewComment} ref={newCommentRef}>
            <CommentInput>
              <Editor
                editorState={editorState}
                onChange={setEditorState}
                placeholder="Ask a question or post an update…"
                expanded={isNewCommentOpened}
              />
            </CommentInput>
            {isNewCommentOpened && <CommentControls>
              <div>

              </div>
              <div>
                <button onClick={submitComment}>Comment</button>
              </div>
            </CommentControls>}
          </CommentField>
        </NewComment>
    </CommentsSection>
  )
}

const CommentsSection = styledComponents.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 16px;
  background-color: #F6F8F9;
  height: calc(30vh);
  overflow: auto;
  padding: 30px;
`
const CommentUnit = styledComponents.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`

const CommentContent = styledComponents.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  width: 100%;
`

const CommentHeader = styledComponents.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  & > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    &:nth-child(1) {
      & > span:nth-child(1) {
        font-weight: bold;
        font-size: 14px;
      }
      & > span:nth-child(2) {
        font-size: 12px;
        color: #9DA3AA;
      }
    }
    &:nth-child(2) {
      & > span {
        cursor: pointer;
      }
    }
  }
`

const CommentBody = styledComponents.div`
  width: 100%;
  color: #222222;
`

const NewComment = styledComponents.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`

const CommentField = styledComponents.div`
  background-color: #FFFFFF;
  width: 100%;
  border-radius: 4px;
  border: 0.5px solid #9198a1;
  transition: border 0.3s, box-shadow 0.3s, height 0.3s;
  &:active {
    border: 0.5px solid #6F7782;
    box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
  }
`

const CommentInput = styledComponents.div`
  min-height: ${props => props.expanded ? "50px" : "16px"};
  max-height: 100px;
  outline: none;
  width: 100%;
  padding: 8px;
  font-size: 14px;
  overflow: auto;
`

const CommentControls = styledComponents.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  & > div {
    display: flex;
    flex-direction: row;
    gap: 10px;
    &:nth-child(2) {
      & > button {
        padding: 8px 12px;
        font-size: 14px;
        border-radius: 8px;
        background-color: #14AAF5;
        cursor: pointer;
        color: #FFFFFF;
        border: none;
        outline: none;
        transition: background-color 0.3s;
        &:hover {
          background-color: #129CE1;
        }
      }
    }
  }
`

export default connect((state) => ({
  user: state.user,
  app: state.app,
  comments: state.comments,
  users: state.users,
}))(Comments);