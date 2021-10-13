import React from 'react';
import { connect } from "react-redux";
import styled from "styled-components";
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
    <SidePanelShell
      isOpened={(isRight && isRightPanelOpened) || (!isRight && isLeftPanelOpened)}
      isRight={isRight}
    >
      {isRight && rightPanelPage && React.createElement(sidePanelPages[rightPanelPage])}
      {!isRight && leftPanelPage && React.createElement(sidePanelPages[leftPanelPage])}
    </SidePanelShell>
  );
};

const SidePanelShell = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  flex: 1;
  transition: all 0.2s ease;
  width: 365px;
  max-width: 365px;
  min-width: 365px;
  background-color: #FFFFFF;
  transform: translateX(${({ isOpened, isRight }) => (isOpened ? "initial" : `${isRight ? "365px" : "-365px"}`)});
  margin: ${({ isOpened, isRight }) => (isOpened ? "0px" : `${isRight ? "0 0 0 -365px" : "0 -365px 0 0"}`)};
  overflow: ${({ isOpened }) => (isOpened ? "auto" : "hidden")};
  & > *:not(:last-child) {
    margin-bottom: 25px;
  }
  @media only screen and (max-width: 768px) {
    position: fixed;
    width: 100vw;
    max-width: 100vw;
    height: 100%;
    transform: translateX(${({ isOpened, isRight }) => (isOpened ? "initial" : `${isRight ? "100%" : "-100%"}`)});
    margin: 0;
  }
  z-index: 9999;
`;

export default connect((state) => ({
  app: state.app
}))(SidePanel);