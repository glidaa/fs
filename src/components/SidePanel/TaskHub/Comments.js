import React, { useMemo, useContext } from 'react';
import { useOuterClick } from 'react-outer-click';
import { useState, useRef } from "react"
import { connect } from "react-redux";
import { AuthState } from "../../../constants";
import styled, { ThemeContext } from "styled-components";
import { stateToHTML } from 'draft-js-export-html';
import { Editor, EditorState, ContentState, convertToRaw, convertFromRaw } from 'draft-js';
import { ReactComponent as CommentsIllustartion } from "../../../assets/undraw_Public_discussion_re_w9up.svg"
import { ReactComponent as RemoveIcon } from "../../../assets/trash-outline.svg"
import * as commentsActions from "../../../actions/comments";
import Avatar from '../../UI/Avatar';

const Comments = (props) => {
  const {
    user,
    users,
    comments,
    app: {
      selectedProject,
      selectedTask
    },
    projects,
    dispatch
  } = props
  const themeContext = useContext(ThemeContext);
  const newCommentRef = useRef(null)
  const [isNewCommentOpened, setIsNewCommentOpened] = useState(false)
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );
  const processComments = (comments) => {
    const commentsArr = Object.values(comments).sort((a, b) => {
      if (new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()) {
        return 1
      } else {
        return -1
      }
    })
    const results = []
    for (const comment of commentsArr) {
      const date = new Date(comment.createdAt).setHours(0, 0, 0, 0)
      const textDateOpts = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
      }
      const textDate = new Date(date).toLocaleDateString("en-GB", textDateOpts)
      if (!results.includes(textDate)) results.push(textDate)
      results.push(comment)
    }
    return results.length ? results : null
  }
  const getReadOnly = (user, projects, selectedProject) => {
    return user.state === AuthState.SignedIn &&
      projects[selectedProject]?.owner !== user.data.username &&
      projects[selectedProject]?.permissions === "r"
  }
  const processedComments = useMemo(() => processComments(comments), [comments])
  const readOnly = useMemo(() => getReadOnly(user, projects, selectedProject), [user, projects, selectedProject])
  const openNewComment = () => {
    if (!isNewCommentOpened) {
      setIsNewCommentOpened(true);
    }
  }
  const removeComment = (comment) => {
    if (comment.owner === user.data.username) {
      dispatch(commentsActions.handleRemoveComment(comment))
    }
  }
  const submitComment = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const content = JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    dispatch(commentsActions.handleCreateComment({
      taskID: selectedTask,
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
    <CommentsContainer>
      <CommentUnits>
        {processedComments && processedComments.map(x => (
          typeof x === "object" ? (
            <CommentUnit key={x.id} isSelf={x.owner === user.data.username}>
              {x.owner !== user.data.username && (
                <Avatar user={users[x.owner]} size={32} circular />
              )}
              <CommentContent>
                <CommentBox>
                  <CommentHeader>
                    <CommenterName>
                      {x.owner === user.data.username && "You"}
                      {x.owner !== user.data.username && (
                        `${users[x.owner].firstName} ${users[x.owner].lastName}`
                      )}
                    </CommenterName>
                    <RemoveBtn onClick={() => removeComment(x)}>         
                      <RemoveIcon
                        height="16"
                        width="16"
                        strokeWidth="32"
                        color={themeContext.primary}
                      />
                    </RemoveBtn>
                  </CommentHeader>
                  <CommentBody
                    dangerouslySetInnerHTML={({
                      __html: stateToHTML(convertFromRaw(JSON.parse(x.content)))
                    })}
                  />
                  <CommentTime>
                    {new Date(x.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </CommentTime>
                </CommentBox>
              </CommentContent>
            </CommentUnit>
          ) : (
            <CommentDay key={x}>{x}</CommentDay>
          )
        ))}
        {!processedComments && (
          <NoComments>
            <CommentsIllustartion />
            <span>
              No Comments On This Task
            </span>
          </NoComments>
        )}
      </CommentUnits>
      {readOnly ? (
        <CommentNotAllowed>
          You can&#39;t comment on this Task
        </CommentNotAllowed>
      ) : (
        <NewComment>
          <Avatar user={user.data} size={32} circular />
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
      )}
    </CommentsContainer>
  )
}

const CommentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
  padding: 0 25px 25px 25px;
  & > *:not(:last-child) {
    margin-bottom: 16px;
  }
`

const CommentContent = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 42px);
`

const CommentHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const RemoveBtn = styled.button`
  outline: none;
  border: none;
  line-height: 0;
  padding: 0;
  background-color: transparent;
  cursor: pointer;
`

const CommenterName = styled.span`
  font-weight: 600;
`

const CommentBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: 14px;
  width: calc(100% - 20px);
  padding: 10px;
`

const CommentBody = styled.div`
  width: 100%;
  & > *:first-child {
    margin-block-start: 0;
  }
  & > *:last-child {
    margin-block-end: 10px;
  }
`

const CommentUnits = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex: 1;
  & > *:not(:last-child) {
    margin-bottom: 8px;
  }
`

const CommentUnit = styled.div`
  display: flex;
  flex-direction: ${({isSelf}) => isSelf ? "row-reverse" : "row"};
  align-items: flex-end;
  & > *:not(:last-child) {
    margin-right: 10px;
  }
  ${CommentBox} {
    ${({isSelf, theme}) => isSelf ? `
      border-radius: 16px 16px 0 16px;
      background-color: ${theme.primaryLight};
      color: ${theme.primary};
    ` : `
      border-radius: 16px 16px 16px 0;
      background-color: ${theme.primary};
      color: ${theme.txtColor};
    `}
  }
`

const NewComment = styled.div`
  display: flex;
  flex-direction: row;
  & > *:not(:last-child) {
    margin-right: 10px;
  }
`

const CommentField = styled.div`
  background-color: ${({theme})=> theme.secondaryBg};
  color: ${({theme})=> theme.txtColor};
  width: 100%;
  border-radius: 8px;
  border: 1px solid #C0C0C0;
  transition: border 0.3s, height 0.3s;
`

const CommentInput = styled.div`
  min-height: ${props => props.expanded ? "50px" : "16px"};
  max-height: 100px;
  outline: none;
  width: 100%;
  padding: 8px;
  font-size: 14px;
  overflow: auto;
`

const CommentControls = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  & > div {
    display: flex;
    flex-direction: row;
    &:nth-child(2) {
      & > button {
        padding: 8px 12px;
        font-size: 14px;
        border-radius: 8px;
        background-color: ${({theme})=> theme.primary};
        cursor: pointer;
        color: #FFFFFF;
        border: none;
        outline: none;
        transition: background-color 0.3s;
        &:hover {
          background-color: ${({theme})=> theme.primaryDark};
        }
        &:disabled {
          background-color: ${({theme})=> theme.primaryLight};
        }
      }
    }
    & > *:not(:last-child) {
      margin-right: 10px;
    }
  }
`

const CommentTime = styled.span`
  position: absolute;
  bottom: 5px;
  right: 10px;
  font-weight: 600;
  font-size: 12px;
  width: fit-content;
`

const CommentDay = styled.span`
  font-weight: 600;
  font-size: 12px;
  color: ${({theme})=> theme.txtColor};
  text-align: center;
  width: 100%;
`

const CommentNotAllowed = styled.span`
  font-weight: 600;
  font-size: 12px;
  color: #C0C0C0;
  text-align: center;
  width: 100%;
`

const NoComments = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
  & > svg {
    width: 250px;
    height: auto;
  }
  & > span {
    font-weight: bold;
    font-size: 18px;
    color: ${({theme})=> theme.txtColor};
  }
  & > *:not(:last-child) {
    margin-bottom: 40px;
  }
`

export default connect((state) => ({
  user: state.user,
  app: state.app,
  comments: state.comments,
  projects: state.projects,
  users: state.users,
}))(Comments);