import React, { useContext } from 'react';
import { ThemeContext } from "styled-components"
import styles from "./TasksLoading.module.scss"
import { connect } from "react-redux";
import { ReactComponent as LoadingSpinner } from "../../assets/infinity-1s-200px.svg"

const TasksLoading = (props) => {
  const themeContext = useContext(ThemeContext)
  return (
    <div className={styles.TasksLoadingContainer}>
      <LoadingSpinner color={themeContext.primary} />
      <div>
        <span>
          Tasks are being fetched
        </span>
      </div>
    </div>
  )
}

export default connect((state) => ({
	user: state.user,
	app: state.app,
	projects: state.projects
}))(TasksLoading);