import React from 'react';
import { connect } from "react-redux";
import * as appActions from "../../actions/app";
import * as appSettingsActions from "../../actions/appSettings";
import styles from "./AppSettings.module.scss"
import SimpleBar from 'simplebar-react';
import { ReactComponent as BackArrowIcon } from "../../assets/chevron-back-outline.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash-outline.svg"
import ColorPicker from '../UI/fields/ColorPicker';
import Toggle from '../UI/fields/Toggle';

const AppSettings = (props) => {
  const {
    appSettings,
    dispatch
  } = props;

  const handleChange = (e) => {
    switch (e.target.name) {
      case "theme":
        dispatch(appSettingsActions.handleSetTheme(e.target.value))
        break
      case "darkMode":
        dispatch(appSettingsActions.handleSetIsDarkMode(e.target.value))
        break
      default:
        break
    }
  }

  const closePanel = () => {
    return dispatch(appActions.handleSetLeftPanel(false))
  }
  const removeProject = () => {
    
  }
  return (
    <>
      <div className={styles.PanelPageToolbar}>
        <button
          className={styles.PanelPageToolbarAction}
          onClick={closePanel}
        >
          <BackArrowIcon
            width={24}
            height={24}
          />
        </button>
        <span className={styles.PanelPageTitle}>
          App Settings
        </span>
        <button
          className={styles.PanelPageToolbarAction}
          onClick={removeProject}
        >
          <RemoveIcon
            width={24}
            height={24}
          />
        </button>
      </div>
      <SimpleBar className={styles.AppSettingsForm}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={styles.AppSetting}>
            <ColorPicker
              label="Theme"
              name="theme"
              value={appSettings.theme}
              onChange={handleChange}
              options={[
                "red",
                "rose",
                "orange",
                "green",
                "turquoise",
                "cyan",
                "blue",
                "pink",
                "purple",
                "black",
              ]}
              colors={[
                "#FB1515",
                "#FF969C",
                "#FE6000",
                "#15fb3b",
                "#15fbd9",
                "#15dcfb",
                "#1560FB",
                "#fb15b2",
                "#5615fb",
                "#000000",
              ]}
            />
            <Toggle
              label="Dark Mode"
              name="darkMode"
              value={appSettings.isDarkMode}
              onChange={handleChange}
            />
          </div>
          <input type="submit" name="submit" value="Submit"></input>
        </form>
      </SimpleBar>
    </>
  );
};

export default connect((state) => ({
  appSettings: state.appSettings
}))(AppSettings);
