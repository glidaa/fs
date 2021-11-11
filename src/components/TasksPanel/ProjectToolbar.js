import React from 'react';
import styles from "./ProjectToolbar.module.scss"
import { connect } from "react-redux";
import * as appActions from "../../actions/app";
import { AuthState, panelPages } from "../../constants";
import { ReactComponent as ShareIcon } from "../../assets/share-outline.svg"
import { ReactComponent as SettingsIcon } from "../../assets/settings-outline.svg"

const ProjectToolbar = (props) => {
  const {
    app: {
      selectedProject,
      isLeftPanelOpened,
      leftPanelPage,
      isSynced
    },
    user,
    projects,
    dispatch,
  } = props;
  const openProjectSettings = () => {
    if (!isLeftPanelOpened || (isLeftPanelOpened && leftPanelPage !== panelPages.PROJECT_SETTINGS)) {
      dispatch(appActions.setLeftPanelPage(panelPages.PROJECT_SETTINGS))
      dispatch(appActions.handleSetLeftPanel(true))
    }
  }
  return (
    <div className={styles.ToolbarContainer}>
      <button
        className={styles.ToolbarAction}
        onClick={() => {
          const linkToBeCopied = window.location.href.replace(/\/\d+/, "")
          navigator.clipboard.writeText(linkToBeCopied)
        }}
      >
        <ShareIcon
          width={14}
          height={14}
        />
        <span>Share</span>
      </button>
      <span>
        {projects[selectedProject].permalink + " "}
        ({user.state !== AuthState.SignedIn ? "local" :
          !isSynced ? "offline" :
          projects[selectedProject].owner === user.data.username ? "owned":
          projects[selectedProject].permissions === "r" ? "read only" :
          projects[selectedProject].permissions === "rw" ? "read write" : null
        })
      </span>
      <button
        className={styles.ToolbarAction}
        onClick={openProjectSettings}
      >
        <SettingsIcon
          width={14}
          height={14}
        />
        <span>Settings</span>
      </button>
    </div>
  )
}

export default connect((state) => ({
  app: state.app,
  user: state.user,
  projects: state.projects,
  appSettings: state.appSettings
}))(ProjectToolbar);
