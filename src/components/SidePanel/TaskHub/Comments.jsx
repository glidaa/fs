import React, { useMemo } from 'react';
import { useOuterClick } from 'react-outer-click';
import { useState, useRef } from "react"
import { AuthState, ThingStatus } from "../../../constants";
import styles from "./Comments.module.scss"
import { useDispatch, useSelector } from "react-redux"
import { ReactComponent as LoadingSpinner } from "../../../assets/Rolling-1s-200px.svg";
import { ReactComponent as CommentsIllustartion } from "../../../assets/undraw_Public_discussion_re_w9up.svg"
import { ReactComponent as RemoveIcon } from "@fluentui/svg-icons/icons/delete_24_regular.svg"
import * as commentsActions from "../../../actions/comments";
import Avatar from '../../UI/Avatar';
import generateId from '../../../utils/generateId';
import Illustration from '../../UI/Illustration';
import formatDate from '../../../utils/formatDate';
import Button from '../../UI/Button';
import { useReadOnly } from '../../ReadOnlyListener';

const Comments = () => {

  const dispatch = useDispatch();
  const readOnly = useReadOnly();

  const selectedProject = useSelector(state => state.projects[state.app.selectedProject])
  const selectedTask = useSelector(state => state.app.selectedTask)
  const isReady = useSelector(state => state.status.comments === ThingStatus.READY && state.status.history === ThingStatus.READY)
  const isSynced = useSelector(state => state.app.isSynced)

  const comments = useSelector(state => state.comments)

  const history = useSelector(state => state.history)

  const user = useSelector(state => state.user)

  const users = useSelector(state => state.users)

  const newCommentRef = useRef(null)
  const [isNewCommentOpened, setIsNewCommentOpened] = useState(false)
  const [newCommentContent, setNewCommentContent] = useState('')
  const processComments = (comments, history) => {
    const commentsArr = [...Object.values(comments), ...Object.values(history)].sort((a, b) => {
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
  const processedComments = useMemo(() => processComments(comments, history), [comments, history])
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
    dispatch(commentsActions.handleCreateComment({
      id: generateId(Object.keys(comments)),
      taskId: selectedTask,
      content: newCommentContent
    }))
    setNewCommentContent('')
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
        {isReady ? (
          processedComments ? processedComments.map(x => (
            typeof x === "string" ? (
              <span className={styles.CommentDay} key={x}>
                {x}
              </span>
            ) : Object.prototype.hasOwnProperty.call(x, "content") ? (
              <div
                className={[
                  styles.CommentUnit,
                  ...(x.owner === user.data?.username && [styles.self] || [])
                ].join(" ")}
                key={x.id}
              >
                {x.owner !== user.data?.username && (
                  <Avatar
                    image={users[x.owner].avatar}
                    initials={users[x.owner].initials}
                    alt={`${users[x.owner].firstName} ${users[x.owner].lastName}`}
                    size={32}
                    circular
                  />
                )}
                <div className={styles.CommentContent}>
                  <div className={styles.CommentBox}>
                    <div className={styles.CommentHeader}>
                      <span className={styles.CommenterName}>
                        {x.owner === user.data?.username && "You"}
                        {x.owner !== user.data?.username && (
                          `${users[x.owner].firstName} ${users[x.owner].lastName}`
                        )}
                      </span>
                      <button
                        className={styles.RemoveBtn}
                        onClick={() => removeComment(x)}
                      >         
                        <RemoveIcon fill="currentColor" />
                      </button>
                    </div>
                    <div className={styles.CommentBody}>
                      {x.content}
                    </div>
                    <span className={styles.CommentTime}>
                      {!x.isVirtual ? (
                        new Date(x.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      ) : "Sending…"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <span className={styles.HistoryItem} key={x.id}>
                <span>
                  {
                    <Avatar
                      size={14}
                      image={users[x.owner].avatar}
                      initials={users[x.owner].initials}
                      alt={`${users[x.owner].firstName} ${users[x.owner].lastName}`}
                      circular
                    />
                  }
                  &nbsp;<b>{x.owner}</b>&nbsp;
                </span>
                {x.field === "assignees" && x.action === "append" && (
                  <span>
                    assigned task to&nbsp;
                    {
                      <Avatar
                        size={14}
                        image={users[x.value].avatar}
                        initials={users[x.value].initials}
                        alt={`${users[x.value].firstName} ${users[x.value].lastName}`}
                        circular
                      />
                    }
                    &nbsp;<b>{x.value}</b>
                  </span> 
                )}
                {x.field === "assignees" && x.action === "remove" && (
                  <span>
                    removed&nbsp;
                    {
                      <Avatar
                        size={14}
                        image={users[x.value].avatar}
                        initials={users[x.value].initials}
                        alt={`${users[x.value].firstName} ${users[x.value].lastName}`}
                        circular
                      />
                    }
                    &nbsp;<b>{x.value}</b>&nbsp;from task
                  </span> 
                )}
                {x.field === "anonymousAssignees" && x.action === "append" && (
                  <span>
                    assigned task to anonymous assignee&nbsp;
                    &quot;<b>{x.value}</b>&quot;
                  </span> 
                )}
                {x.field === "anonymousAssignees" && x.action === "remove" && (
                  <span>
                    removed anonymous assignee&nbsp;
                    &quot;<b>{x.value}</b>&quot; from task
                  </span> 
                )}
                {x.field === "invitedAssignees" && x.action === "append" && (
                  <span>
                    invited&nbsp;
                    &quot;<b>{x.value}</b>&quot; to be assigned
                  </span> 
                )}
                {x.field === "invitedAssignees" && x.action === "remove" && (
                  <span>
                    invited&nbsp;
                    &quot;<b>{x.value}</b>&quot; to be assigned
                  </span> 
                )}
                {x.field === "watchers" && x.action === "append" && (
                  <span>
                    added&nbsp;
                    {
                      <Avatar
                        size={14}
                        image={users[x.value].avatar}
                        initials={users[x.value].initials}
                        alt={`${users[x.value].firstName} ${users[x.value].lastName}`}
                        circular
                      />
                    }
                    &nbsp;<b>{x.value}</b> to task watchers
                  </span> 
                )}
                {x.field === "watchers" && x.action === "remove" && (
                  <span>
                    removed&nbsp;
                    {
                      <Avatar
                        size={14}
                        image={users[x.value].avatar}
                        initials={users[x.value].initials}
                        alt={`${users[x.value].firstName} ${users[x.value].lastName}`}
                        circular
                      />
                    }
                    &nbsp;<b>{x.value}</b>&nbsp;from task watchers
                  </span> 
                )}
                {x.field === "due" && x.action === "update" && (
                  parseInt(x.value, 10) ? (
                    <span>
                      changed due date to&nbsp;
                      <b>{formatDate(x.value)}</b>.
                    </span>
                  ) : (
                    <span>
                      cleared task due date
                    </span>
                  )
                )}
                {x.field === "priority" && x.action === "update" && (
                  <span>
                    changed priority to&nbsp;
                    <b>{x.value}</b>.
                  </span>
                )}
                {x.field === "status" && x.action === "update" && (
                  <span>
                    changed status to&nbsp;
                    <b>{selectedProject.statusSet.find(y => y.id === x.value).title}</b>
                  </span>
                )}
              </span>
            )
          )) : (
            <Illustration
              illustration={CommentsIllustartion}
              title="No Comments On This Task"
              secondary
            />
          )
        ) : (
          <div className={styles.LoadingContainer}>
            <LoadingSpinner />
          </div>
        )}
      </div>
      {isReady && (
        readOnly ? (
          <span className={styles.CommentNotAllowed}>
            {user.state !== AuthState.SignedIn ?
            "Login to comment on this task" :
            !isSynced ?
            "Intenret connection is lost" :
            "You don't have permission to comment on this task"}
          </span>
        ) : (
          <div className={styles.NewComment}>
            <Avatar
              image={user.data.avatar}
              initials={user.data.initials}
              alt={`${user.data.firstName} ${user.data.lastName}`}
              size={32}
              circular
            />
            <div
              className={styles.CommentField}
              onClick={openNewComment}
              ref={newCommentRef}
            >
              <div className={styles.CommentInput}>
                <textarea
                  placeholder='Ask a question or post an update…'
                  value={newCommentContent}
                  rows={isNewCommentOpened ? 3 : 1}
                  onChange={(e) => setNewCommentContent(e.target.value)}
                />
              </div>
              {isNewCommentOpened && (
                <div className={styles.CommentControls}>
                  <div>

                  </div>
                  <div>
                    <Button label="Comment" onClick={submitComment} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  )
}

export default Comments;