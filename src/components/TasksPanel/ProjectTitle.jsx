import React from 'react';
import styles from "./ProjectTitle.module.scss"
import { useDispatch, useSelector } from "react-redux";
import * as appActions from "../../actions/app"
import * as projectsActions from "../../actions/projects"
import * as tasksActions from "../../actions/tasks"
import { initTaskState, ThingStatus } from '../../constants';
import sortByRank from '../../utils/sortByRank';
import generateRank from '../../utils/generateRank';

const ProjectTitle = (props) => {

  const {
    readOnly
  } = props;

  const dispatch = useDispatch();

  const isProjectTitleSelected = useSelector(state => state.app.isProjectTitleSelected);
  const tasksStatus = useSelector(state => state.status.tasks);

  const selectedProject = useSelector(state => state.projects[state.app.selectedProject]);

  const tasks = useSelector(state => state.tasks);

  const onChange = (e) => {
    dispatch(projectsActions.handleUpdateProjectTitle({
      id: selectedProject.id,
      title: e.target.value
    }))
  };

  const onKeyUp = (e) => {
    const firstTask = sortByRank(tasks)[0];
    if (e.key === "Enter") {
      if (tasksStatus === ThingStatus.READY) {
        appActions.handleSetProjectTitle(false)
        dispatch(
          tasksActions.handleCreateTask(
            initTaskState(
              selectedProject.id,
              generateRank(undefined, firstTask?.rank),
              selectedProject.defaultStatus,
              Object.keys(tasks)
            )
          )
        )
      }
    } else if (e.key === "ArrowDown") {
      dispatch(appActions.handleSetProjectTitle(false))
      if (firstTask) {
        return dispatch(appActions.handleSetTask(firstTask.id))
      }
    } else if (e.key === "Escape") {
      return dispatch(appActions.handleSetProjectTitle(false))
    }
  };

  const selectTitle = () => {
    dispatch(appActions.handleSetProjectTitle(true))
  }

  return (
    <div className={styles.ProjectTitleShell}>
      {isProjectTitleSelected ? (
        <div className={styles.ProjectTitleInput}>
          <input
            type="text"
            placeholder="Project Title…"
            value={selectedProject.title || ""}
            onKeyUp={onKeyUp}
            onChange={onChange}
            autoFocus
            readOnly={readOnly}
          />
        </div>
      ) : (
        <span
          className={[
            styles.ProjectTitleHeader,
            ...(!selectedProject.title && [styles.placeholder] || [])
          ].join(" ")}
          onClick={selectTitle}
        >
          {selectedProject.title || "Project Title…"}
        </span>
      )}
    </div>
  );
};

export default ProjectTitle;
