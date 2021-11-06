import React from 'react';
import styles from "./TasksLoading.module.scss"
import { ReactComponent as LoadingSpinner } from "../../assets/infinity-1s-200px.svg"

const TasksLoading = () => {
  return (
    <div className={styles.TasksLoadingContainer}>
      <LoadingSpinner />
      <div>
        <span>
          Tasks are being fetched
        </span>
      </div>
    </div>
  )
}

export default TasksLoading;