import React, { useContext } from 'react';
import styled, { ThemeContext } from "styled-components";
import { connect } from "react-redux";
import * as appActions from "../../actions/app";
import { panelPages } from "../../constants";
import { ReactComponent as ShareIcon } from "../../assets/share-outline.svg"
import { ReactComponent as SettingsIcon } from "../../assets/settings-outline.svg"

const ProjectToolbar = (props) => {
  const {
    app: {
      selectedProject,
      isLeftPanelOpened,
      leftPanelPage
    },
    projects,
    dispatch,
  } = props;
  const themeContext = useContext(ThemeContext);
  const openProjectSettings = () => {
    if (!isLeftPanelOpened || (isLeftPanelOpened && leftPanelPage !== panelPages.PROJECT_SETTINGS)) {
      dispatch(appActions.setLeftPanelPage(panelPages.PROJECT_SETTINGS))
      dispatch(appActions.handleSetLeftPanel(true))
    }
  }
  return (
    <ToolbarContainer>
      <ToolbarAction
        onClick={() => {
          const linkToBeCopied = window.location.href.replace(/\/\d+/, "")
          navigator.clipboard.writeText(linkToBeCopied)
        }}
      >
        <ShareIcon
          width={14}
          height={14}
          strokeWidth={32}
          color={themeContext.primary}
        />
        <span>Share</span>
      </ToolbarAction>
      <span>
        {projects[selectedProject].permalink}
      </span>
      <ToolbarAction onClick={openProjectSettings}>
        <SettingsIcon
          width={14}
          height={14}
          strokeWidth={32}
          color={themeContext.primary}
        />
        <span>Settings</span>
      </ToolbarAction>
    </ToolbarContainer>     
  )
}

const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  margin: 0 12px;
  & > span {
    color: ${({theme})=> theme.txtColor};
    font-size: 12px;
  }
	@media only screen and (max-width: 768px) {
		margin: 20px 20px 10px 20px;
	}
`

const ToolbarAction = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 5px;
  line-height: 0;
  width: 80px;
  color: ${({theme})=> theme.primary};
  border: none;
  outline: none;
  cursor: pointer;
  border-radius: 6px;
  background-color: ${({theme})=> theme.primaryLight};
  & > *:not(:last-child) {
    margin-right: 3px;
  }
`

export default connect((state) => ({
  app: state.app,
  projects: state.projects
}))(ProjectToolbar);
