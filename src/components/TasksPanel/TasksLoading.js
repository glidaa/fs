import React from 'react';
import themes from "../../themes"
import styles from "./TasksLoading.module.scss"
import { connect } from "react-redux";
import { ReactComponent as LoadingSpinner } from "../../assets/infinity-1s-200px.svg"

const TasksLoading = (props) => {
  const {
    appSettings
  } = props
  const theme = themes[appSettings.theme]
  return (
    <div className={styles.TasksLoadingContainer}>
      <LoadingSpinner color={theme.primary} />
      <div>
        <span>
          Tasks are being fetched
        </span>
      </div>
    </div>
  )
}

export default connect((state) => ({
  appSettings: state.appSettings
}))(TasksLoading);