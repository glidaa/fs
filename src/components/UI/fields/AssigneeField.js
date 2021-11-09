import React, { useMemo, useEffect, useRef } from 'react';
import { connect } from "react-redux"
import styles from "./AssigneeField.module.scss"
import * as tasksActions from "../../../actions/tasks"
import * as appActions from "../../../actions/app";
import { ReactComponent as RemoveIcon } from "../../../assets/close-outline.svg"
import { panelPages } from "../../../constants";
import ShadowScroll from '../../ShadowScroll';
import Avatar from '../Avatar';

const AssigneeField = (props) => {
  const {
    label,
    name,
    value,
    readOnly,
    style,
    app: {
      selectedTask
    },
    users,
    dispatch
  } = props

  const assigneeFieldRef = useRef(null)

  useEffect(() => {
    if (assigneeFieldRef.current) {
      assigneeFieldRef.current.addEventListener("wheel", (e) => {
        e.preventDefault();
        assigneeFieldRef.current.scrollLeft += e.deltaY;
      });
    }
  }, [assigneeFieldRef])

  const openChooser = () => {
    return dispatch(appActions.setRightPanelPage(panelPages.ASSIGNEE_CHOOSER))
  }

  const processValue = (value, users) => {
    const result = []
    for (const assignee of value) {
      const isValidAssignee = /^(user|anonymous):(.*)$/.test(assignee)
      if (isValidAssignee) {
        const [, assigneeType, assigneeID] = assignee.match(/(user|anonymous):(.*)/)
        const isUser = assigneeType === "user"
        if (isUser) {
          result.push({...users[assigneeID], username: assigneeID, raw: assignee, isUser})
        } else {
          result.push({ name: assigneeID, raw: assignee, isUser })
        }
      }
    }
    return result
  }

  const processedValue = useMemo(() => processValue(value, users), [value, users]);

  const handleUnassignTask = (username) => {
    dispatch(tasksActions.handleUnassignTask(selectedTask, username))
  }

  return (
    <div className={styles.AssigneeFieldShell} style={style}>
      {label && (
        <label htmlFor={name}>
          {label}
        </label>
      )}
      {(processedValue.length) ? (
        <ShadowScroll>
          {!readOnly && (
            <button
              className={styles.NewAssigneeBtn}
              onClick={openChooser}
            >
              <div>+</div>
              <span>Assign</span>
            </button>
          )}
          {processedValue.map(x => (
            <span className={styles.AssigneeItem} key={x.raw}>
              <button
                className={styles.RemoveBtn}
                onClick={() => handleUnassignTask(x.raw)}
              >
                <RemoveIcon
                  height={16}
                  width={16}
                />
              </button>
              <Avatar user={x} size={36} circular />
              <div className={styles.AssigneeDetails}>
                <span>{x.firstName || x.name}</span>
                <span>{x.username ? `@${x.username}` : "Anonymous"}</span>
              </div>
            </span>
          ))}
        </ShadowScroll>
      ) : (
        <div className={styles.NoAssignees}>
          <span>No Users Assigned Yet</span>
          {!readOnly && (
            <button onClick={openChooser}>
              + Add Assignee
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default connect((state) => ({
    app: state.app,
    users: state.users
  }))(AssigneeField);