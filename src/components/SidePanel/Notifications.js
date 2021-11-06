import React from 'react';
import { connect } from "react-redux";
import * as appActions from "../../actions/app";
import styles from "./Notifications.module.scss"
import SimpleBar from 'simplebar-react';
import { ReactComponent as CloseIcon } from "../../assets/close-outline.svg"
import { ReactComponent as BackArrowIcon } from "../../assets/chevron-back-outline.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash-outline.svg"
import Avatar from '../UI/Avatar';

const Notifications = (props) => {
  const {
    notifications,
    users,
    dispatch
  } = props;

  const closePanel = () => {
    return dispatch(appActions.handleSetLeftPanel(false))
  }
  const removeProject = () => {
    
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
          onClick={removeProject}
        >
          <RemoveIcon
            width={24}
            height={24}
          />
        </button>
      </div>
      <SimpleBar className={styles.NotificationsForm}>
        {notifications.stored.map(x => (
          <div
            className={[
              styles.NotificationShell,
              "noselect",
              ...(x.payload.link && [styles.clickable] || [])
            ].join(" ")}
            key={x.id}
          >
            <div className={styles.NotificationContainer}>
              <Avatar user={users[x.sender]} size={32} />
              <div>
                <div className={styles.NotificationTopPart}>
                  <span>
                    {users[x.sender].firstName} {users[x.sender].lastName}
                  </span>
                  <span>
                    {new Date(x.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                  </span>
                </div>
                <div className={styles.NotificationBottomPart}>
                  {x.type === "ASSIGNMENT" && (
                    <span>
                      Assigned a task to&nbsp;
                      {x.payload.assignee ? 
                      (<b>@{x.payload.assignee}</b>) : "you"}.
                      Tap here to review it.
                    </span>
                  )}
                  {/* <button className={styles.NotificationCloseBtn}>
                    <CloseIcon
                      height="16"
                      width="16"
                    />
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </SimpleBar>
    </>
  );
};

export default connect((state) => ({
  notifications: state.notifications,
  users: state.users
}))(Notifications);
