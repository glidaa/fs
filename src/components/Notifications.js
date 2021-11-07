import React, { useRef, useState, useEffect } from 'react';
import { connect } from "react-redux";
import styles from "./Notifications.module.scss"
import * as notificationsActions from "../actions/notifications"
import Notification from './UI/Notification';

const Notifications = (props) => {
  const {
    notifications,
    dispatch
  } = props;
  const notificationElem = useRef(null)
  const dismissTimer = useRef(null)
  const [anim, setAnim] = useState(0)
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
        <Notification
          key={notifications.pushed[0]}
          ref={notificationElem}
          headsUp={true}
          notificationData={notifications.pushed[0]}
          anim={anim}
          onDismiss={dismissNotification}
        />
      )}
    </div>
  );
};

export default connect((state) => ({
  notifications: state.notifications
}))(Notifications);
