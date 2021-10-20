import React from 'react';
import { connect } from "react-redux";
import styles from "./index.module.scss";
import "draft-js/dist/Draft.css";
import ASSIGNEE_CHOOSER from "./AssigneeChooser"
import WATCHER_CHOOSER from "./WatcherChooser"
import TASK_HUB from "./TaskHub"
import PROJECTS from "./Projects"
import ACCOUNT_SETTINGS from "./AccountSettings"
import PROJECT_SETTINGS from "./ProjectSettings"
import APP_SETTINGS from "./AppSettings"
import NOTIFICATIONS from "./Notifications"

const sidePanelPages = {
    ASSIGNEE_CHOOSER,
    WATCHER_CHOOSER,
    TASK_HUB,
    PROJECTS,
    ACCOUNT_SETTINGS,
    PROJECT_SETTINGS,
    APP_SETTINGS,
    NOTIFICATIONS
}

const SidePanel = (props) => {
  const {
    app: {
      isRightPanelOpened,
      isLeftPanelOpened,
      rightPanelPage,
      leftPanelPage
    },
    isRight
  } = props;
  return (
    <div
      className={[
        styles.SidePanelShell,
        ...(isRight && [styles.right] || []),
        ...(((isRight && isRightPanelOpened) || (!isRight && isLeftPanelOpened)) && [styles.opened] || [])
      ].join(" ")}
    >
      {isRight && rightPanelPage && React.createElement(sidePanelPages[rightPanelPage])}
      {!isRight && leftPanelPage && React.createElement(sidePanelPages[leftPanelPage])}
    </div>
  );
};

export default connect((state) => ({
  app: state.app
}))(SidePanel);