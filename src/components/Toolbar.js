import React from 'react';
import styledComponents from "styled-components";
import * as appActions from "../actions/app"
import { connect } from "react-redux";
import PasteBtn from "./PasteBtn";
import useWindowSize from "../utils/useWindowSize";
import { ReactComponent as ShareIcon } from "../assets/share-outline.svg"
import { ReactComponent as ProjectsIcon } from "../assets/albums-outline.svg"
import { ReactComponent as NotificationIcon } from "../assets/notifications-outline.svg"
import { ReactComponent as SettingsIcon } from "../assets/settings-outline.svg"
import { ReactComponent as LoginIcon } from "../assets/log-in-outline.svg"

const TasksPanel = (props) => {
  const {
    app: {
      selectedProject,
      isProjectsPanelOpened,
      history
    },
    projects,
    dispatch
  } = props;
  let { width } = useWindowSize();
  const openProjectsPanel = () => {
    dispatch(appActions.handleSetProjectsPanel(true))
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
        <ToolbarAction onClick={openProjectsPanel}>
          <NotificationIcon
              width="24"
              height="24"
              strokeWidth="32"
              color="#222222"
          />
        </ToolbarAction>
        <ToolbarAction onClick={openProjectsPanel}>
          <ProjectsIcon
              width="24"
              height="24"
              strokeWidth="32"
              color={isProjectsPanelOpened ? "#006EFF" : "#222222"}
          />
        </ToolbarAction>
        <ToolbarAction onClick={openProjectsPanel}>
          <SettingsIcon
              width="24"
              height="24"
              strokeWidth="32"
              color="#222222"
          />
        </ToolbarAction>
      </TopControls>
      <BottomControls>
        <ShareBtn
          width="20"
          height="20"
          strokeWidth="32"
          color="#006EFF"
          onClick={() => {
            const linkToBeCopied = window.location.href.replace(/\/\d+/, "")
            navigator.clipboard.writeText(linkToBeCopied)
          }}
        />
        <Spacer color="#222222" />
        <UserIndicator onClick={goToLoginPage}>
          <LoginIcon
              width="24"
              height="24"
              strokeWidth="32"
              color="#FFFFFF"
          />
        </UserIndicator>
      </BottomControls>
    </ToolbarContainer>
  );
};

const ToolbarContainer = styledComponents.div`
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #FFFFFF;
  flex-direction: column;
  padding: 30px 15px;
  width: 40px;
  height: calc(100vh - 60px);
	@media only screen and (max-width: 768px) {
		padding: 15px 20px 0 20px;
	}
`;

const TopControls = styledComponents.div`
  display: flex;
  gap: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const BottomControls = styledComponents.div`
  display: flex;
  gap: 15px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ToolbarAction = styledComponents.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  background-color: transparent;
  cursor: pointer;
`

const Spacer = styledComponents.div`
  border-top: 1px solid ${({ color }) => color};
  width: 100%;
`

const ShareBtn = styledComponents(ShareIcon)`
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  background-color: #FFFFFF;
  border: 1px solid #006EFF;
`

const Logo = styledComponents.span`
  color: #006EFF;
  font-weight: 900;
  font-size: 22px;
`

const UserIndicator = styledComponents(ToolbarAction)`
  background-color: #006EFF;
  border-radius: 8px;
  padding: 10px;
`

export default connect((state) => ({
  tasks: state.tasks,
  app: state.app,
  projects: state.projects,
}))(TasksPanel);
