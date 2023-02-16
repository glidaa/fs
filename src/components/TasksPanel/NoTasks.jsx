import React from "react";
import { ReactComponent as LoadingSpinner } from "../../assets/infinity-1s-200px.svg";
import { ReactComponent as EmptyTasksIllustration } from "../../assets/undraw_note_list_re_r4u9.svg";
import { ReactComponent as OfflineIllustration } from "../../assets/undraw_signal_searching_bhpc.svg";
import { ReactComponent as NoResultsIllustration } from "../../assets/undraw_not_found_60pq.svg";
import Illustration from "../UI/Illustration";

const NoTasks = (props) => {
  const { msgId } = props;
  return (
    <Illustration
      illustration={
        msgId === "LOADING"
          ? LoadingSpinner
          : msgId === "EMPTY"
          ? EmptyTasksIllustration
          : msgId === "NO_RESULTS"
          ? NoResultsIllustration
          : msgId === "OFFLINE"
          ? OfflineIllustration
          : null
      }
      title={
        msgId === "LOADING"
          ? "Tasks Are Being Fetched"
          : msgId === "EMPTY"
          ? "Tap To Create New Task"
          : msgId === "NO_RESULTS"
          ? "No Results Found"
          : msgId === "OFFLINE"
          ? "You Are Offline Now"
          : null
      }
    />
  );
};

export default NoTasks;
