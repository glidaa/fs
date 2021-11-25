import React from 'react';
import styles from "./NoTasks.module.scss"
import { ReactComponent as LoadingSpinner } from "../../assets/infinity-1s-200px.svg"
import { ReactComponent as EmptyTasksIllustration } from "../../assets/undraw_Add_notes_re_ln36.svg"
import { ReactComponent as OfflineIllustration } from "../../assets/undraw_signal_searching_bhpc.svg"
import { ReactComponent as NoResultsIllustration } from "../../assets/infinity-1s-200px.svg"

const NoTasks = (props) => {
  const { msgID } = props;
  return (
    <div
      name="NoTasks"
      className={[
        styles.NoTasksContainer,
        ...(msgID === "LOADING" && [styles.loader] || [])
      ].join(" ")}
    >
      { msgID === "LOADING" ? (
        <LoadingSpinner />
      ) : msgID === "EMPTY" ? (
        <EmptyTasksIllustration />
      ) : msgID === "NO_RESULTS" ? (
        <LoadingSpinner />
      ) : msgID === "OFFLINE" ? (
        <OfflineIllustration />
      ) : null}
      <div>
        <span>
          { msgID === "LOADING" ? (
            "Tasks Are Being Fetched"
          ) : msgID === "EMPTY" ? (
            "Tap To Create New Task"
          ) : msgID === "NO_RESULTS" ? (
            "Tasks are being fetched"
          ) : msgID === "OFFLINE" ? (
            "You Are Offline Now"
          ) : null}
        </span>
      </div>
    </div>
  )
}

export default NoTasks;