import React, { startTransition  } from 'react';
import styles from "./Toolbar.module.scss"
import * as appActions from "../actions/app"
import { connect } from "react-redux";
import { panelPages, AuthState } from "../constants"
import { ReactComponent as ProjectsIcon } from "../assets/albums-outline.svg"
import { ReactComponent as NotificationIcon } from "../assets/notifications-outline.svg"
import { ReactComponent as SettingsIcon } from "../assets/settings-outline.svg"
import { ReactComponent as LoginIcon } from "../assets/log-in-outline.svg"
import Avatar from './UI/Avatar';
import { useNavigate } from 'react-router-dom';

const Toolbar = (props) => {
  const {
    app: {
      isLeftPanelOpened,
      leftPanelPage
    },
    user,
    dispatch
  } = props;
  const navigate = useNavigate();
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
    return navigate("/login")
  }
  return (
    <div className={styles.ToolbarContainer}>
      <div className={styles.TopControls}>
        <span className={styles.Logo}>/.</span>
        <div className={styles.Spacer} />
        <button
          className={[
            styles.ToolbarAction,
            ...(isLeftPanelOpened && leftPanelPage === panelPages.NOTIFICATIONS ? [styles.selected] : [])
          ].join(" ")}
          onClick={() => openLeftPanel(panelPages.NOTIFICATIONS)}
        >
          <NotificationIcon
            width={24}
            height={24}
          />
          <span>Updates</span>
        </button>
        <button
          className={[
            styles.ToolbarAction,
            ...(isLeftPanelOpened && leftPanelPage === panelPages.PROJECTS ? [styles.selected] : [])
          ].join(" ")}
          onClick={() => openLeftPanel(panelPages.PROJECTS)}
        >
          <ProjectsIcon
            width={24}
            height={24}
          />
          <span>Projects</span>
        </button>
        <button
          className={[
            styles.ToolbarAction,
            ...(isLeftPanelOpened && leftPanelPage === panelPages.APP_SETTINGS ? [styles.selected] : [])
          ].join(" ")}
          onClick={() => openLeftPanel(panelPages.APP_SETTINGS)}
        >
          <SettingsIcon
            width={24}
            height={24}
          />
          <span>Settings</span>
        </button>
      </div>
      <div className={styles.BottomControls}>
          {user.state === AuthState.SignedIn ? (
              <button
                className={styles.ToolbarAction}
                style={{padding: 0}}
                onClick={() => openLeftPanel(panelPages.ACCOUNT_SETTINGS)}
              >
                <Avatar user={user.data} size={42} />
              </button>
          ) : (
            <button
              className={[
                styles.ToolbarAction,
                styles.LoginBtn
              ].join(" ")}
              onClick={goToLoginPage}
            >
              <LoginIcon
                width={24}
                height={24}
              />
            </button>
          )}
      </div>
    </div>
  );
};

export default connect((state) => ({
  app: state.app,
  user: state.user
}))(Toolbar);
