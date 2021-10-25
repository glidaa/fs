import React from 'react';
import { connect } from "react-redux";
import * as appActions from "../../actions/app";
import * as appSettingsActions from "../../actions/appSettings";
import themes from "../../themes"
import styles from "./AppSettings.module.scss"
import SimpleBar from 'simplebar-react';
import { ReactComponent as BackArrowIcon } from "../../assets/chevron-back-outline.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash-outline.svg"

const AppSettings = (props) => {
  const {
    appSettings: {
      tasksSortingCriteria,
    },
    appSettings,
    dispatch
  } = props;

  const theme = themes[appSettings.theme];

  const handleChange = (e) => {
    switch (e.target.name) {
      case "theme":
        dispatch(appSettingsActions.handleSetTheme(e.target.value))
        break
      case "tasksSortingCriteria":
        dispatch(appSettingsActions.handleSetTasksSortingCriteria(e.target.value))
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
              strokeWidth={32}
              color={theme.primary}
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
              strokeWidth={32}
              color={theme.primary}
          />
        </button>
      </div>
      <SimpleBar className={styles.AppSettingsForm}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={styles.AppSetting}>
            <label htmlFor="tasksSortingCriteria">
              Sort Tasks By
            </label>
            <select
              className={styles.SelectField}
              name="tasksSortingCriteria"
              onChange={handleChange}
              value={tasksSortingCriteria}
            >
              <option value="BY_DEFAULT">default</option>
              <option value="BY_DUE">due date</option>
              <option value="BY_STATUS">status</option>
              <option value="BY_PRIORITY">priority</option>
            </select>
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
