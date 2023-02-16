import React, { forwardRef, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from "react-redux";
import * as appActions from "../../actions/app";
import * as appSettingsActions from "../../actions/appSettings";
import styles from "./AppSettings.module.scss"
import ColorPicker from '../UI/fields/ColorPicker';
import Toggle from '../UI/fields/Toggle';

const AppSettings = forwardRef((_, ref) => {

  const dispatch = useDispatch();

  const appSettings = useSelector(state => state.appSettings);

  const handleChange = (e) => {
    switch (e.target.name) {
      case "theme":
        dispatch(appSettingsActions.handleSetTheme(e.target.value))
        break
      case "darkMode":
        dispatch(appSettingsActions.handleSetIsDarkMode(e.target.value))
        break
      case "dueDate":
        dispatch(appSettingsActions.handleSetShowDueDate(e.target.value))
        break
      case "assignees":
        dispatch(appSettingsActions.handleSetShowAssignees(e.target.value))
        break
      case "doneIndicator":
        dispatch(appSettingsActions.handleSetShowDoneIndicator(e.target.value))
        break
      case "copyButton":
        dispatch(appSettingsActions.handleSetShowCopyButton(e.target.value))
        break
      case "duplicateButton":
        dispatch(appSettingsActions.handleSetShowDuplicateButton(e.target.value))
        break
      case "shareButton":
        dispatch(appSettingsActions.handleSetShowShareButton(e.target.value))
        break
      default:
        break
    }
  }

  const closePanel = () => {
    return dispatch(appActions.handleSetLeftPanel(false))
  }
  useImperativeHandle(ref, () => ({
    panelProps: {
      title: "App Settings",
      onClose: () => {
        closePanel()
      }
    }
  }));
  return (
    <form onSubmit={(e) => e.preventDefault()} className={styles.AppSettingsForm}>
        <ColorPicker
          label="Theme"
          name="theme"
          value={appSettings.theme}
          onChange={handleChange}
          options={[
            "red",
            "gold",
            "orange",
            "green",
            "turquoise",
            "blue",
            "pink",
            "purple",
            "grey",
            "black",
          ]}
          colors={!appSettings.isDarkMode ? [
            "#D20E1E",
            "#E19D00",
            "#E05307",
            "#0E6D0E",
            "#009FAA",
            "#0067C0",
            "#CD007B",
            "#4F4DCE",
            "#586579",
            "#000000",
          ] : [
            "#F46762",
            "#FFD52A",
            "#FB9A44",
            "#45E532",
            "#29F7FF",
            "#4CC2FF",
            "#FF4FCB",
            "#B5ADEB",
            "#ADBBC5",
            "#FFFFFF",
          ]}
        />
        <Toggle
          label="Dark Mode"
          name="darkMode"
          value={appSettings.isDarkMode}
          onChange={handleChange}
        />
        <div className={styles.AppSetting}>
        <span>Task Item Customization</span>
        <span className={styles.AppSettingSectionHeader}>
          When Not Selected
        </span>
        <Toggle
          label="Due Date"
          name="dueDate"
          value={appSettings.showDueDate}
          onChange={handleChange}
        />
        <Toggle
          label="Assignees"
          name="assignees"
          value={appSettings.showAssignees}
          onChange={handleChange}
        />
        <Toggle
          label="Done Indicator"
          name="doneIndicator"
          value={appSettings.showDoneIndicator}
          onChange={handleChange}
        />
        <span className={styles.AppSettingSectionHeader}>
          When Selected
        </span>
        <Toggle
          label="Copy Button"
          name="copyButton"
          value={appSettings.showCopyButton}
          onChange={handleChange}
        />
        <Toggle
          label="Duplicate Button"
          name="duplicateButton"
          value={appSettings.showDuplicateButton}
          onChange={handleChange}
        />
        <Toggle
          label="Share Button"
          name="shareButton"
          value={appSettings.showShareButton}
          onChange={handleChange}
        />
      </div>
    </form>
  );
});

AppSettings.displayName = "AppSettings";

export default AppSettings;
