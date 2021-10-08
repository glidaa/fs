import React from 'react';
import styled from "styled-components";
import * as appActions from "../actions/app"
import { connect } from "react-redux";
import { panelPages, AuthState } from "../constants"
import { ReactComponent as ProjectsIcon } from "../assets/albums-outline.svg"
import { ReactComponent as NotificationIcon } from "../assets/notifications-outline.svg"
import { ReactComponent as SettingsIcon } from "../assets/settings-outline.svg"
import { ReactComponent as LoginIcon } from "../assets/log-in-outline.svg"
import Avatar from './UI/Avatar';
import { glassmorphism } from '../styles';

const TasksPanel = (props) => {
  const {
    app: {
      isLeftPanelOpened,
      leftPanelPage,
      history
    },
    user,
    dispatch
  } = props;
  const openLeftPanel = (page) => {
    if (!isLeftPanelOpened || (isLeftPanelOpened && leftPanelPage !== page)) {
      dispatch(appActions.setLeftPanelPage(page))
      dispatch(appActions.handleSetLeftPanel(true))
    } else {
      dispatch(appActions.handleSetLeftPanel(false))
    }
  }
  const goToLoginPage = () => {
    dispatch(appActions.handleSetTask(null))
    return history.push("/login")
  }
  return (
    <ToolbarContainer>
      <TopControls>
        <Logo>/.</Logo>
        <Spacer color="transparent" />
        <ToolbarAction onClick={() => openLeftPanel(panelPages.PROJECTS)}>
          <NotificationIcon
              width="24"
              height="24"
              strokeWidth="32"
              color="#000000"
          />
        </ToolbarAction>
        <ToolbarAction onClick={() => openLeftPanel(panelPages.PROJECTS)}>
          <ProjectsIcon
              width="24"
              height="24"
              strokeWidth="32"
              color={
                isLeftPanelOpened && leftPanelPage === panelPages.PROJECTS ?
                "var(--primary)" : "#000000"
              }
          />
        </ToolbarAction>
        <ToolbarAction onClick={() => openLeftPanel(panelPages.APP_SETTINGS)}>
          <SettingsIcon
              width="24"
              height="24"
              strokeWidth="32"
              color={
                isLeftPanelOpened && leftPanelPage === panelPages.APP_SETTINGS ?
                "var(--primary)" : "#000000"
              }
          />
        </ToolbarAction>
      </TopControls>
      <BottomControls>
          {user.state === AuthState.SignedIn ? (
              <ToolbarAction style={{padding: 0}} onClick={() => openLeftPanel(panelPages.ACCOUNT_SETTINGS)}>
                <Avatar user={user.data} size={42} />
              </ToolbarAction>
          ) : (
            <ToolbarAction onClick={goToLoginPage}>
              <LoginIcon
                width="24"
                height="24"
                strokeWidth="32"
                color="var(--primary)"
              />
            </ToolbarAction>
          )}
      </BottomControls>
    </ToolbarContainer>
  );
};

const ToolbarContainer = styled.div`
  ${glassmorphism(0)}
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  padding: 30px 15px;
  width: 40px;
  height: calc(100vh - 60px);
	@media only screen and (max-width: 768px) {
    padding: 15px 20px;
    flex-direction: row;
    bottom: 10px;
    top: auto;
    margin: 0 10px;
    width: calc(100vw - 40px - 20px);
    height: 40px;
    border-radius: 16px;
    ::before {
      border-radius: 16px;
    }
    ::after {
      content: "";
      background: black;
      position: absolute;
      z-index: -2;
      width: 100vw;
      height: 100px;
      left: -10px;
      top: -10px;
      bottom: 0;
      right: 0;
      background-color: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
	}
`;

const TopControls = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
	@media only screen and (max-width: 768px) {
    flex-direction: row;
  }
`;

const BottomControls = styled.div`
  display: flex;
  gap: 15px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
	@media only screen and (max-width: 768px) {
    flex-direction: row;
    & > *:not(:last-child) {
      display: none;
    }
  }
`;

const ToolbarAction = styled.button`
  ${glassmorphism(8, 0.2, 0.8)}
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  padding: 10px;
  margin: 0;
  background-color: transparent;
  cursor: pointer;
`

const Spacer = styled.div`
  border-top: 1px solid ${({ color }) => color};
  width: 100%;
`

const Logo = styled.span`
  color: var(--primary);
  font-weight: 900;
  font-size: 22px;
`

export default connect((state) => ({
  app: state.app,
  user: state.user
}))(TasksPanel);
