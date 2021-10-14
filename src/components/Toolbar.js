import React, { startTransition, useContext  } from 'react';
import styled, { ThemeContext } from "styled-components";
import * as appActions from "../actions/app"
import { connect } from "react-redux";
import { panelPages, AuthState } from "../constants"
import { ReactComponent as ProjectsIcon } from "../assets/albums-outline.svg"
import { ReactComponent as NotificationIcon } from "../assets/notifications-outline.svg"
import { ReactComponent as SettingsIcon } from "../assets/settings-outline.svg"
import { ReactComponent as LoginIcon } from "../assets/log-in-outline.svg"
import Avatar from './UI/Avatar';
import { useHistory } from 'react-router-dom';

const TasksPanel = (props) => {
  const {
    app: {
      isLeftPanelOpened,
      leftPanelPage
    },
    user,
    dispatch
  } = props;
  const history = useHistory();
  const themeContext = useContext(ThemeContext);
  const openLeftPanel = (page) => {
    if (!isLeftPanelOpened || (isLeftPanelOpened && leftPanelPage !== page)) {
      dispatch(appActions.setLeftPanelPage(page))
      startTransition(() => {
        dispatch(appActions.handleSetLeftPanel(true))
      })
    } else {
      startTransition(() => {
        dispatch(appActions.handleSetLeftPanel(false))
      })
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
        <ToolbarAction onClick={() => openLeftPanel(panelPages.NOTIFICATIONS)}>
          <NotificationIcon
              width="24"
              height="24"
              strokeWidth="32"
              color={themeContext.txtColor}
          />
        </ToolbarAction>
        <ToolbarAction onClick={() => openLeftPanel(panelPages.PROJECTS)}>
          <ProjectsIcon
              width="24"
              height="24"
              strokeWidth="32"
              color={
                isLeftPanelOpened && leftPanelPage === panelPages.PROJECTS ?
                themeContext.primary : themeContext.txtColor
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
                themeContext.primary : themeContext.txtColor
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
            <LoginBtn onClick={goToLoginPage}>
              <LoginIcon
                width="24"
                height="24"
                strokeWidth="32"
                color="#FFFFFF"
              />
            </LoginBtn>
          )}
      </BottomControls>
    </ToolbarContainer>
  );
};

const ToolbarContainer = styled.div`
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
  background-color: ${({theme})=> theme.secondaryBg};
	@media only screen and (max-width: 768px) {
    padding: 15px 20px;
    flex-direction: row;
    bottom: 10px;
    top: auto;
    margin: 0 10px;
    width: calc(100vw - 40px - 20px);
    height: 40px;
    border-radius: 16px;
	}
`;

const TopControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & > *:not(:last-child) {
    margin-bottom: 20px;
  }
	@media only screen and (max-width: 768px) {
    flex-direction: row;
    & > *:not(:last-child) {
      margin-bottom: 0px;
      margin-right: 20px;
    }
  }
`;

const BottomControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & > *:not(:last-child) {
    margin-bottom: 15px;
  }
	@media only screen and (max-width: 768px) {
    flex-direction: row;
    & > *:not(:last-child) {
      display: none;
      margin-bottom: 0px;
      margin-right: 15px;
    }
  }
`;

const ToolbarAction = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  margin: 0;
  background-color: transparent;
  cursor: pointer;
`

const LoginBtn = styled(ToolbarAction)`
  padding: 10px;
  border-radius: 8px;
  background-color: ${({theme})=> theme.primary};
`

const Spacer = styled.div`
  border-top: 1px solid ${({ color }) => color};
  width: 100%;
`

const Logo = styled.span`
  color: ${({theme})=> theme.primary};
  font-weight: 900;
  font-size: 22px;
`

export default connect((state) => ({
  app: state.app,
  user: state.user
}))(TasksPanel);
