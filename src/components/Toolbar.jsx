import React from 'react';
import styles from "./Toolbar.module.scss"
import * as appActions from "../actions/app"
import { useDispatch, useSelector } from "react-redux";
import { panelPages, AuthState } from "../constants"
import { ReactComponent as ProjectsIcon } from "@fluentui/svg-icons/icons/app_folder_24_regular.svg";
import { ReactComponent as ProjectsFilledIcon } from "@fluentui/svg-icons/icons/app_folder_24_filled.svg";
import { ReactComponent as NotificationIcon } from "@fluentui/svg-icons/icons/alert_24_regular.svg";
import { ReactComponent as NotificationFilledIcon } from "@fluentui/svg-icons/icons/alert_24_filled.svg";
import { ReactComponent as SettingsIcon } from "@fluentui/svg-icons/icons/settings_24_regular.svg";
import { ReactComponent as SettingsFilledIcon } from "@fluentui/svg-icons/icons/settings_24_filled.svg";
import { ReactComponent as LoginIcon } from "@fluentui/svg-icons/icons/person_add_24_regular.svg";
import Avatar from './UI/Avatar';
import { navigate } from './Router';

const Toolbar = () => {
  const dispatch = useDispatch();

  const isLeftPanelOpened = useSelector(state => state.app.isLeftPanelOpened);
  const leftPanelPage = useSelector(state => state.app.leftPanelPage);

  const userState = useSelector(state => state.user.state);
  const userImage = useSelector(state => state.user.data?.avatar);
  const userInitials = useSelector(state => state.user.data?.initials);
  const userFullName = useSelector(state => `${state.user.data?.firstName} ${state.user.data?.lastName}`);

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
    return navigate("/login")
  }
  return (
    <div
      className={[
        styles.ToolbarContainer,
        ...(isLeftPanelOpened ? [styles.selected] : []),
        "no-keyboard-portrait-flex"
      ].join(" ")}
    >
      <div className={styles.TopControls}>
        <span className={styles.Logo}>/.</span>
        <div className={styles.Spacer} />
        {userState === AuthState.SignedIn && (
          <button
            className={[
              styles.ToolbarAction,
              ...(isLeftPanelOpened && leftPanelPage === panelPages.NOTIFICATIONS ? [styles.selected] : [])
            ].join(" ")}
            onClick={() => openLeftPanel(panelPages.NOTIFICATIONS)}
          >
            {(isLeftPanelOpened && leftPanelPage === panelPages.NOTIFICATIONS) ? (
              <NotificationFilledIcon fill="currentColor" />
            ) : (
              <NotificationIcon fill="currentColor" />
            )}
            <span>Updates</span>
          </button>
        )}
        <button
          className={[
            styles.ToolbarAction,
            ...(isLeftPanelOpened && leftPanelPage === panelPages.PROJECTS ? [styles.selected] : [])
          ].join(" ")}
          onClick={() => openLeftPanel(panelPages.PROJECTS)}
        >
          {(isLeftPanelOpened && leftPanelPage === panelPages.PROJECTS) ? (
            <ProjectsFilledIcon fill="currentColor" />
          ) : (
            <ProjectsIcon fill="currentColor" />
          )}
          <span>Projects</span>
        </button>
        <button
          className={[
            styles.ToolbarAction,
            ...(isLeftPanelOpened && leftPanelPage === panelPages.APP_SETTINGS ? [styles.selected] : [])
          ].join(" ")}
          onClick={() => openLeftPanel(panelPages.APP_SETTINGS)}
        >
          {(isLeftPanelOpened && leftPanelPage === panelPages.APP_SETTINGS) ? (
            <SettingsFilledIcon fill="currentColor" />
          ) : (
            <SettingsIcon fill="currentColor" />
          )}
          <span>Settings</span>
        </button>
      </div>
      <div className={styles.BottomControls}>
          {userState === AuthState.SignedIn ? (
            <button
              className={styles.AvatarBtn}
              style={{ padding: 0 }}
              onClick={() => openLeftPanel(panelPages.ACCOUNT_SETTINGS)}
            >
              <Avatar
                image={userImage}
                initials={userInitials}
                alt={userFullName}
                size={42}
              />
            </button>
          ) : (
            <button
              className={[
                styles.ToolbarAction,
                styles.LoginBtn
              ].join(" ")}
              onClick={goToLoginPage}
            >
              <LoginIcon fill="currentColor" />
            </button>
          )}
      </div>
    </div>
  );
};

export default Toolbar;
