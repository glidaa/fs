import React from "react";
import * as tasksActions from "../../actions/tasks";
import { useDispatch, useSelector } from "react-redux";
import { ThingStatus, initTaskState } from "../../constants";
import styles from "./TaskPlaceholder.module.scss";
import sortByRank from "../../utils/sortByRank";
import generateRank from "../../utils/generateRank";
import { useReadOnly } from "../ReadOnlyListener";

const TaskPlaceholder = (props) => {
  const {
    preset = {},
    content = "Tap to create new task…",
  } = props;

  const dispatch = useDispatch();
  const readOnly = useReadOnly();

  const selectedProject = useSelector(state => state.app.selectedProject);
  const isSynced = useSelector(state => state.app.isSynced);

  const tasks = useSelector(state => state.tasks);

  const tasksStatus = useSelector(state => state.status.tasks);

  const projects = useSelector(state => state.projects);

  const addNewTask = () => {
      !readOnly &&
      tasksStatus === ThingStatus.READY &&
      isSynced &&
      dispatch(
        tasksActions.handleCreateTask(
          initTaskState(
            selectedProject,
            generateRank(sortByRank(tasks, true)[0]?.rank),
            projects[selectedProject].defaultStatus,
            Object.keys(tasks),
            preset
          )
        )
      );
  };
  return !readOnly && tasksStatus === ThingStatus.READY && isSynced ? (
    <span
      name="TaskPlaceholder"
      className={[styles.TaskPlaceholder, "noselect"].join(" ")}
      onClick={addNewTask}
    >
      {content}
    </span>
  ) : null;
};

export default TaskPlaceholder;
