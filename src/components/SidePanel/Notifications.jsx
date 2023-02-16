import React, { forwardRef, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from "react-redux";
import * as mutations from "../../graphql/mutations"
import * as appActions from "../../actions/app";
import * as notificationsActions from "../../actions/notifications";
import { ReactComponent as NoNotificationsIllustration } from "../../assets/undraw_notify_re_65on.svg";
import { ReactComponent as RemoveIcon } from "@fluentui/svg-icons/icons/delete_24_regular.svg";
import { ReactComponent as LoadingSpinner } from "../../assets/Rolling-1s-200px.svg";
import Notification from '../UI/Notification';
import { navigate } from '../Router';
import API from '../../amplify/API';
import Illustration from '../UI/Illustration';
import { ThingStatus } from '../../constants';
import styles from "./Notifications.module.scss"

const Notifications = forwardRef((_, ref) => {
  
  const dispatch = useDispatch();

  const isSynced = useSelector(state => state.app.isSynced);
  const isReady = useSelector(state => state.status.notifications === ThingStatus.READY)

  const users = useSelector(state => state.users);

  const notifications = useSelector(state => state.notifications);

  const closePanel = () => {
    dispatch(appActions.handleSetLeftPanel(false))
  }
  const dismissNotifications = () => {
    API.execute(mutations.dismissNotifications)
    .then(() => {
      dispatch(notificationsActions.emptyNotifications())
    })
  }
  const handleOpenNotification = (link) => {
    navigate(link);
    closePanel()
  }
  useImperativeHandle(ref, () => ({
    panelProps: {
      title: "Notifications",
      actionIcon: isSynced ? RemoveIcon : null,
      onClose: () => {
        closePanel()
      },
      onAction: () => {
        dismissNotifications();
      }
    }
  }));
  const dismissNotification = (e, id) => {
    e.stopPropagation()
    API.execute(mutations.dismissNotification, { input: { id } })
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  }
  return isReady ? (
    notifications.stored.length ? notifications.stored.map(x => (
      <Notification
        key={x.id}
        notificationData={x}
        dismissable={isSynced}
        onOpen={handleOpenNotification}
        onDismiss={(e) => dismissNotification(e, x.id)}
        senderData={users[x.mutator]}
      />
    )) : (
      <Illustration
        illustration={NoNotificationsIllustration}
        title="All caught up!"
        secondary
      />
    )
  ) : (
    <div className={styles.LoadingContainer}>
      <LoadingSpinner />
    </div>
  )
});

Notifications.displayName = "Notifications";

export default Notifications;
