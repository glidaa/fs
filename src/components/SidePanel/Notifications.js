import React from 'react';
import { connect } from "react-redux";
import * as appActions from "../../actions/app";
import * as appSettingsActions from "../../actions/appSettings";
import themes from "../../themes"
import styles from "./Notifications.module.scss"
import CustomScroller from 'react-custom-scroller';
import { ReactComponent as CloseIcon } from "../../assets/close-outline.svg"
import { ReactComponent as BackArrowIcon } from "../../assets/chevron-back-outline.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash-outline.svg"
import Avatar from '../UI/Avatar';

const Notifications = (props) => {
  const {
    notifications,
    users,
    appSettings,
    dispatch
  } = props;

  const theme = themes[appSettings.theme];

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
              strokeWidth={32}
              color={theme.primary}
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
              strokeWidth={32}
              color={theme.primary}
          />
        </button>
      </div>
      <CustomScroller className={styles.NotificationsForm}>
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
              <div className={styles.NotificationContent}>
                <Avatar user={users[x.sender]} size={32} />
                <div>
                  <span className={styles.NotificationHeading}>
                    <b style={{ float: "left" }}>
                      {users[x.sender].firstName} {users[x.sender].lastName}
                    </b>
                    <span style={{ float: "right" }}>
                      {new Date(x.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                    </span>
                  </span>
                  {x.type === "ASSIGNMENT" && (
                    <span>
                      Assigned a task to&nbsp;
                      {x.payload.assignee ? 
                      (<b>@{x.payload.assignee}</b>) : "you"}.
                      Tap here to review it.
                    </span>
                  )}
                </div>
              </div>
              {/* <button className={styles.NotificationCloseBtn}>
                <CloseIcon
                  height="16"
                  width="16"
                  strokeWidth="32"
                  color={theme.primary}
                />
              </button> */}
            </div>
          </div>
        ))}
      </CustomScroller>
    </>
  );
};

export default connect((state) => ({
  notifications: state.notifications,
  users: state.users,
  appSettings: state.appSettings
}))(Notifications);
