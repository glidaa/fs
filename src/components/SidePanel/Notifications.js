import React, { useState } from 'react';
import { connect } from "react-redux";
import * as appActions from "../../actions/app";
import styles from "./Notifications.module.scss"
import SimpleBar from 'simplebar-react';
import { ReactComponent as CloseIcon } from "../../assets/close-outline.svg"
import { ReactComponent as ChevronUpIcon } from "../../assets/chevron-up-outline.svg"
import { ReactComponent as ChevronDownIcon } from "../../assets/chevron-down-outline.svg"
import { ReactComponent as BackArrowIcon } from "../../assets/chevron-back-outline.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash-outline.svg"
import Avatar from '../UI/Avatar';
import Notification from '../UI/Notification';

const Notifications = (props) => {
  const {
    notifications,
    users,
    dispatch
  } = props;

  const [expandedComment, setExpandedComment] = useState(null);

  const handleSetExpandedComment = (comment) => {
    if (expandedComment === comment) {
      setExpandedComment(null);
    } else {
      setExpandedComment(comment);
    }
  }

  const closePanel = () => {
    return dispatch(appActions.handleSetLeftPanel(false))
  }
  const dismissNotifications = () => {
    
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
        >
          <RemoveIcon
            width={24}
            height={24}
          />
        </button>
      </div>
      <SimpleBar className={styles.NotificationsForm}>
        {notifications.stored.map(x => (
          <Notification key={x.id} notificationData={x} />
        ))}
      </SimpleBar>
    </>
  );
};

export default connect((state) => ({
  notifications: state.notifications,
  users: state.users
}))(Notifications);
