import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import styles from "./Notifications.module.scss"
import * as notificationsActions from "../actions/notifications"
import { navigate } from './Router';
import Notification from './UI/Notification';

const Notifications = () => {
  const dismissTimer = useRef(null)
  const [anim, setAnim] = useState(0)
  const dispatch = useDispatch();

  const notifications = useSelector(state => state.notifications);

  const users = useSelector(state => state.users);

  const dismissNotification = (e) => {
    if (e) e.stopPropagation()
    clearTimeout(dismissTimer.current)
    setAnim(1)
  }
  const handleAnimationEnd = () => {
    if (anim === 1) {
      dispatch(notificationsActions.dismiss(notifications.pushed[0]?.id))
      setAnim(0)
    }
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
          key={notifications.pushed[0].id}
          notificationData={notifications.pushed[0]}
          onOpen={navigate}
          onDismiss={dismissNotification}
          onAnimationEnd={handleAnimationEnd}
          senderData={users[notifications.pushed[0].mutator]}
          className={[
            styles.NotificationOverride,
            ...(anim === 0 && [styles.entering] || []),
            ...(anim === 1 && [styles.exiting] || [])
          ].join(" ")}
        />
      )}
    </div>
  );
};

export default Notifications;
