import React, { useMemo } from 'react';
import { useOuterClick } from 'react-outer-click';
import { useState, useRef } from "react"
import { connect } from "react-redux";
import { AuthState } from "../../../constants";
import styles from "./Comments.module.scss"
import { stateToHTML } from 'draft-js-export-html';
import { Editor, EditorState, ContentState, convertToRaw, convertFromRaw } from 'draft-js';
import { ReactComponent as CommentsIllustartion } from "../../../assets/undraw_Public_discussion_re_w9up.svg"
import { ReactComponent as RemoveIcon } from "../../../assets/trash-outline.svg"
import * as commentsActions from "../../../actions/comments";
import Avatar from '../../UI/Avatar';
import generateID from '../../../utils/generateID';

const Comments = (props) => {
  const {
    user,
    users,
    comments,
    app: {
      selectedProject,
      selectedTask,
      isSynced
    },
    projects,
    dispatch
  } = props
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
  const getReadOnly = (user, projects, selectedProject, isSynced) => {
    return user.state === AuthState.SignedIn &&
    ((projects[selectedProject]?.owner !== user.data.username &&
    projects[selectedProject]?.permissions === "r") || !isSynced)
  }
  const processedComments = useMemo(() => processComments(comments), [comments])
  const readOnly = useMemo(() => getReadOnly(user, projects, selectedProject, isSynced), [user, projects, selectedProject, isSynced])
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
      id: generateID(),
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
    <div className={styles.CommentsContainer}>
      <div className={styles.CommentUnits}>
        {processedComments && processedComments.map(x => (
          typeof x === "object" ? (
            <div
              className={[
                styles.CommentUnit,
                ...(x.owner === user.data.username && [styles.self] || [])
              ].join(" ")}
              key={x.id}
            >
              {x.owner !== user.data.username && (
                <Avatar user={users[x.owner]} size={32} circular />
              )}
              <div className={styles.CommentContent}>
                <div className={styles.CommentBox}>
                  <div className={styles.CommentHeader}>
                    <span className={styles.CommenterName}>
                      {x.owner === user.data.username && "You"}
                      {x.owner !== user.data.username && (
                        `${users[x.owner].firstName} ${users[x.owner].lastName}`
                      )}
                    </span>
                    <button
                      className={styles.RemoveBtn}
                      onClick={() => removeComment(x)}
                    >         
                      <RemoveIcon
                        height={16}
                        width={16}
                      />
                    </button>
                  </div>
                  <div
                    className={styles.CommentBody}
                    dangerouslySetInnerHTML={({
                      __html: stateToHTML(convertFromRaw(JSON.parse(x.content)))
                    })}
                  />
                  <span className={styles.CommentTime}>
                    {!x.isVirtual ? (
                      new Date(x.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    ) : "Sending…"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <span className={styles.CommentDay} key={x}>
              {x}
            </span>
          )
        ))}
        {!processedComments && (
          <div className={styles.NoComments}>
            <CommentsIllustartion />
            <span>
              No Comments On This Task
            </span>
          </div>
        )}
      </div>
      {readOnly ? (
        <span className={styles.CommentNotAllowed}>
          You can&#39;t comment on this Task
        </span>
      ) : (
        <div className={styles.NewComment}>
          <Avatar user={user.data} size={32} circular />
          <div
            className={styles.CommentField}
            onClick={openNewComment}
            ref={newCommentRef}
          >
            <div className={styles.CommentInput}>
              <Editor
                editorState={editorState}
                onChange={setEditorState}
                placeholder="Ask a question or post an update…"
                expanded={isNewCommentOpened}
              />
            </div>
            {isNewCommentOpened && (
              <div className={styles.CommentControls}>
                <div>

                </div>
                <div>
                  <button onClick={submitComment}>Comment</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default connect((state) => ({
  user: state.user,
  app: state.app,
  comments: state.comments,
  projects: state.projects,
  users: state.users
}))(Comments);