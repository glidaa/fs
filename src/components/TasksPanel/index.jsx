import React, { useEffect, useState } from 'react';
import styles from "./index.module.scss";
import { useDispatch, useSelector } from "react-redux";
import sortByRank from "../../utils/sortByRank";
import ProjectNotSelected from "./ProjectNotSelected";
import * as tasksActions from "../../actions/tasks";
import { ThingStatus, initTaskState, AuthState } from "../../constants";
import sortedTasks from './sortedTasks';
import ProjectToolbar from './ProjectToolbar';
import NoTasks from './NoTasks';
import ProjectHeader from './ProjectHeader';
import generateRank from '../../utils/generateRank';
import { useModal } from '../ModalManager';
import modals from '../modals';
import BatchRibbon from './BatchRibbon';
import Banner from '../UI/Banner';
import { navigate } from '../Router';
import { useReadOnly } from '../ReadOnlyListener';

const TasksPanel = () => {
  const { showModal } = useModal();
  const [inDropZone, setInDropZone] = useState(false)
  const dispatch = useDispatch();
  const readOnly = useReadOnly();

  const selectedProject = useSelector(state => state.app.selectedProject);
  const isSynced = useSelector(state => state.app.isSynced);

  const tasksSortingCriteria = useSelector(state => state.appSettings.tasksSortingCriteria);

  const defaultStatus = useSelector(state => state.projects[selectedProject]?.defaultStatus);

  const tasks = useSelector(state => state.tasks);

  const tasksStatus = useSelector(state => state.status.tasks);

  const user = useSelector(state => state.user);

  const addNewTask = (e) => {
    selectedProject &&
    (e.target.getAttribute("name") === "TasksPanelContainer" ||
    (document.querySelector("[name='TasksView']") === e.target) ||
    document.querySelector("[class*='IllustrationContainer']")?.contains(e.target) && !Object.keys(tasks).length) &&
    tasksStatus === ThingStatus.READY &&
    isSynced &&
    dispatch(
      tasksActions.handleCreateTask(
        initTaskState(
          selectedProject,
          generateRank(sortByRank(tasks, true)[0]?.rank),
          defaultStatus,
          Object.keys(tasks)
        )
      )
    )
  }
  const handleDragEnter = (e) => {
    if (selectedProject) {
      e.preventDefault();
      e.stopPropagation();
      setInDropZone(true);
    }
  };
  const handleDragOver = (e) => {
    if (selectedProject) {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'copy';
      setInDropZone(true);
    }
  };
  const handleDragLeave = (e) => {
    if (selectedProject) {
      if (e.target.getAttribute("name") === "TasksPanelContainer") {
        e.preventDefault();
        e.stopPropagation();
        setInDropZone(false);
      }
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedProject) {
      const file = e.dataTransfer ?
        e.dataTransfer.files?.[0] :
        e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = function () {
          const importedBlob = new Blob([reader.result], { type: file.type });
          importedBlob["name"] = file.name;
          showModal(modals.IMPORT, { importedBlob })
        };
      }
    }
    setInDropZone(false);
  };
  useEffect(() => {
    if (!selectedProject) {
      setInDropZone(false);
    }
  }, [selectedProject])
  return (
    <div className={styles.TasksPanelShell}>
      <div
        name="TasksPanelContainer"
        className={[
          styles.TasksPanelContainer,
          ...((tasksStatus === ThingStatus.READY ||
            tasksStatus === ThingStatus.FETCHING) && [styles.ready] || []),
          ...(inDropZone && [styles.inDropZone] || [])
        ].join(" ")}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={addNewTask}
      >
        {selectedProject ? (
          <>
            {user.state !== AuthState.SignedIn && (
              <Banner
                content="Login or create a free account to save your work on cloud, collaborate with others and more…"
                onClick={() => navigate("/login")}
              />
            )}
            {user.state === AuthState.SignedIn && !isSynced && (
              <Banner
                content="You are browsing cached version of projects because no internet connection."
                variant="critical"
              />
            )}
            {user.state === AuthState.SignedIn && isSynced && readOnly && (
              <Banner
                content="You are only allowed to browse this project."
                variant="caution"
              />
            )}
            {tasksStatus === ThingStatus.FETCHING ? (
              <NoTasks msgId="LOADING" />
            ) : (
              <>
                <ProjectHeader />
                {Object.keys(tasks).length ? (
                  <div name="TasksView" className={`${styles.TasksView} sleek-scrollbar`}>
                    {React.createElement(sortedTasks[tasksSortingCriteria])}
                  </div>
                ) : isSynced ? (
                  <NoTasks name="NoTasks" msgId="EMPTY" />
                ) : (
                  <NoTasks msgId="OFFLINE" />
                )}
              </>
            )}
            <ProjectToolbar />
            <BatchRibbon />
          </>
        ) : <ProjectNotSelected />}
      </div>
    </div>
  )
}

export default TasksPanel;
