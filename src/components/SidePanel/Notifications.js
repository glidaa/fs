import React from 'react';
import { connect } from "react-redux";
import { graphqlOperation } from "@aws-amplify/api";
import * as mutations from "../../graphql/mutations"
import * as appActions from "../../actions/app";
import * as notificationsActions from "../../actions/notifications";
import styles from "./Notifications.module.scss"
import SimpleBar from 'simplebar-react';
import { ReactComponent as NoNotificationsIllustration } from "../../assets/undraw_notify_re_65on.svg";
import { ReactComponent as BackArrowIcon } from "../../assets/chevron-back-outline.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash-outline.svg"
import Notification from '../UI/Notification';
import execGraphQL from '../../utils/execGraphQL';

const Notifications = (props) => {
  const {
    notifications,
    app: {
      isSynced
    },
    dispatch
  } = props;

  const closePanel = () => {
    return dispatch(appActions.handleSetLeftPanel(false))
  }
  const dismissNotifications = () => {
    execGraphQL(
      graphqlOperation(
        mutations.dismissNotifications
      )
    ).then(() => {
      dispatch(notificationsActions.emptyNotifications())
    })
  }
  const dismissNotification = (e, id) => {
    e.stopPropagation()
    execGraphQL(
      graphqlOperation(
        mutations.dismissNotification,
        { notificationID: id }
      )
    ).then(() => {
      console.log("Notification dismissed")
    }).catch(err => {
      console.log(err)
    })
  }
  return (
    <>
      <div className={styles.PanelPageToolbar}>
        <button
          className={styles.PanelPageToolbarAction}
          onClick={closePanel}
        >
          <BackArrowIcon
            width={24}
            height={24}
          />
        </button>
        <span className={styles.PanelPageTitle}>
          Notifications
        </span>
        <button
          className={styles.PanelPageToolbarAction}
          onClick={dismissNotifications}
          disabled={!isSynced}
        >
          <RemoveIcon
            width={24}
            height={24}
          />
        </button>
      </div>
      <SimpleBar className={styles.NotificationsForm}>
        {notifications.stored.length ? notifications.stored.map(x => (
          <Notification
            key={x.id}
            notificationData={x}
            onDismiss={(e) => dismissNotification(e, x.id)}
          />
        )) : (
          <div className={styles.NoNotifications}>
            <NoNotificationsIllustration />
            <span>
              All caught up!
            </span>
          </div>
        )}
      </SimpleBar>
    </>
  );
};

export default connect((state) => ({
  app: state.app,
  notifications: state.notifications,
}))(Notifications);
