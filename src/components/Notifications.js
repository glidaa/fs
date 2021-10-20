import React, { useRef, useState, useEffect } from 'react';
import { connect } from "react-redux";
import { useHistory } from 'react-router-dom';
import themes from "../themes"
import styles from "./Notifications.module.scss"
import * as notificationsActions from "../actions/notifications"
import { ReactComponent as CloseIcon } from "../assets/close-outline.svg"
import Avatar from './UI/Avatar';

const Notifications = (props) => {
  const {
    users,
    notifications,
    appSettings,
    dispatch
  } = props;
  const theme = themes[appSettings.theme];
  const history = useHistory();
  const notificationElem = useRef(null)
  const dismissTimer = useRef(null)
  const [anim, setAnim] = useState(0)
  const openLink = (link) => link && history.push(link)
  const dismissNotification = (e) => {
    if (e) e.stopPropagation()
    clearTimeout(dismissTimer.current)
    setAnim(1)
    notificationElem.current.addEventListener("animationend", () => {
      dispatch(notificationsActions.dismiss(notifications.pushed[0]?.id))
      setAnim(0)
    })
  }
  useEffect(() => {
    clearTimeout(dismissTimer.current)
    if (notifications.pushed[0]) {
      dismissTimer.current = setTimeout(dismissNotification, 5000)
    }
  }, [notifications.pushed[0]?.id])
  return (
    <div className={styles.NotificationsContainer}>
      {notifications.pushed[0] && (
        <div
          className={[
            styles.NotificationShell,
            ...(anim === 0 && [styles.entering] || []),
            ...(anim !== 0 && [styles.exiting] || []),
            ...(notifications.pushed[0].payload.link && [styles.clickable] || [])
          ].join(" ")}
          key={notifications.pushed[0]}
          ref={notificationElem}
          onClick={() => openLink(notifications.pushed[0].payload.link)}
        >
          <div className={styles.NotificationContainer}>
            <div className={styles.NotificationContent}>
              <Avatar user={users[notifications.pushed[0].sender]} size={32} />
              <div>
                  {notifications.pushed[0].type === "ASSIGNMENT" && (
                    <span>
                      <b>@{notifications.pushed[0].sender} </b>
                      has assigned a task to&nbsp;
                      {notifications.pushed[0].payload.assignee ? 
                      (<b>@{notifications.pushed[0].payload.assignee}</b>) : "you"}. 
                      Tap here to review it.
                    </span>
                  )}
              </div>
            </div>
            <button
              className={styles.NotificationCloseBtn}
              onClick={dismissNotification}
            >
              <CloseIcon
                height="16"
                width="16"
                strokeWidth="32"
                color={theme.primary}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default connect((state) => ({
  users: state.users,
  notifications: state.notifications,
  appSettings: state.appSettings
}))(Notifications);
