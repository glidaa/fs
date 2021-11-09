import React, { useState, forwardRef } from 'react';
import { connect } from "react-redux";
import styles from "./Notification.module.scss"
import { useNavigate } from 'react-router-dom';
import { ReactComponent as CloseIcon } from "../../assets/close-outline.svg"
import { ReactComponent as ChevronUpIcon } from "../../assets/chevron-up-outline.svg"
import { ReactComponent as ChevronDownIcon } from "../../assets/chevron-down-outline.svg"
import Avatar from './Avatar';

const UnconnectedNotification = (props) => {
  const {
    notificationRef,
    anim,
    headsUp,
    onDismiss,
    notificationData,
    users
  } = props
  const navigate = useNavigate();
  const openLink = (link) => link && navigate("/" + link);
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div
      ref={notificationRef}
      className={[
        styles.NotificationShell,
        "noselect",
        ...(notificationData.payload.link && [styles.clickable] || []),
        ...(headsUp && [styles.headsUp] || []),
        ...(anim === 0 && [styles.entering] || []),
        ...(anim === 1 && [styles.exiting] || []),
        ...(isExpanded && [styles.expanded] || [])
      ].join(" ")}
      onClick={() => openLink(notificationData.payload.link)}
    >
      <div className={styles.NotificationControls}>
        <div onClick={(e) => {
          e.stopPropagation()
          setIsExpanded(!isExpanded)
        }}>
          <span>
            {new Date(notificationData.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
          </span>
          {isExpanded ? (
            <ChevronUpIcon
              width={12}
              height={12}
            />
          ) : (
            <ChevronDownIcon
              width={12}
              height={12}
            />
          )}
        </div>
        <button
          className={styles.NotificationCloseBtn}
          onClick={onDismiss}
        >
          <CloseIcon
            height={16}
            width={16}
          />
        </button>
      </div>
      <div className={styles.NotificationContainer}>
        <Avatar user={users[notificationData.sender]} size={32} />
        <div>
          <div className={styles.NotificationTopPart}>
            <span>
              {users[notificationData.sender].firstName} {users[notificationData.sender].lastName}
            </span>
          </div>
          <div className={styles.NotificationBottomPart}>
            {notificationData.type === "ASSIGNMENT" && (
              <span>
                Assigned a task to&nbsp;
                {notificationData.payload.assignee ? 
                (<b>@{notificationData.payload.assignee}</b>) : "you"}.
                Tap here to review it.
              </span>
            )}
            {notificationData.type === "DUE_CHANGE" && (
              parseInt(notificationData.payload.old_due, 10) ? (
                <span>
                  Changed due date of a task from&nbsp;
                  <b>{new Date(parseInt(notificationData.payload.old_due, 10)).toLocaleDateString()}</b> to&nbsp;
                  <b>{new Date(parseInt(notificationData.payload.new_due, 10)).toLocaleDateString()}</b>.
                  Tap here to review it.
                </span>
              ) : (
                <span>
                  Set due date of a task to&nbsp;
                  <b>{new Date(parseInt(notificationData.payload.new_due, 10)).toLocaleDateString()}</b>.
                  Tap here to review it.
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const ConnectedNotification = connect((state) => ({
  users: state.users
}))(UnconnectedNotification);

const Notification = (props, ref) => (
  <ConnectedNotification {...props} notificationRef={ref} />
);

export default forwardRef(Notification);
