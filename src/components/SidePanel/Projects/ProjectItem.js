import React from "react"
import styles from "./ProjectItem.module.scss"
import { connect } from "react-redux";
import * as appActions from "../../../actions/app"
import * as projectsActions from "../../../actions/projects";
import formatDate from "../../../utils/formatDate";
import ProgressRing from "../../UI/ProgressRing";
import { ReactComponent as GlobeIcon } from "../../../assets/earth-outline.svg"
import { ReactComponent as DocumentLockIcon } from "../../../assets/document-lock-outline.svg"
import { ReactComponent as RemoveIcon } from "../../../assets/trash-outline.svg"
import { ReactComponent as ShareIcon } from "../../../assets/share-outline.svg"

const ProjectItem = (props) => {
  const {
    app: {
      selectedProject
    },
    project,
    readOnly,
    dispatch,
    listeners
  } = props
  const shareProject = (e) => {
    e.stopPropagation()
    const linkToBeCopied = window.location.href.replace(/\/\d+/, "")
    navigator.clipboard.writeText(linkToBeCopied)
  }
  const removeProject = (e) => {
    e.stopPropagation()
    if (!readOnly) {
      dispatch(projectsActions.handleRemoveProject(project))
    }
  }
  const selectProject = (id) => {
    if (selectedProject !== project.id) {
      dispatch(appActions.handleSetLeftPanel(false))
      dispatch(appActions.handleSetProject(id))
    }
  } 
  return (
    <div
      className={[
        styles.ProjectItemShell,
        "noselect",
        ...(selectedProject === project.id && [styles.selected] || [])
      ].join(" ")}
      onClick={() => selectProject(project.id)}
      {...listeners}
    >
      <div className={styles.ProjectItemPermission}>
        {project.privacy === "public" && (
          <GlobeIcon
            height={200}
            width={200}
            strokeWidth={24}
          />
        )}
        {project.privacy === "private" && (
          <DocumentLockIcon
            height={200}
            width={200}
            strokeWidth={24}
          />
        )}
      </div>
      <div className={styles.ProjectItemContainer}>
        <div className={styles.ProjectItemLeftPart}>
          <div className={styles.ProjectItemHeader}>
            <span className={styles.ProjectItemTitle}>
              {project.title || "Untitled Project"}
            </span>
            <span className={styles.ProjectItemPermalink}>
              {project.permalink}
            </span>
          </div>
          <div className={styles.TasksCount}>
            <span
              className={[
                styles.TasksCountItem,
                styles.TodoTasksCount
              ].join(" ")}
            >
              {project.todoCount}
            </span>
            <span
              className={[
                styles.TasksCountItem,
                styles.PendingTasksCount
              ].join(" ")}
            >
              {project.pendingCount}
            </span>
            <span
              className={[
                styles.TasksCountItem,
                styles.DoneTasksCount
              ].join(" ")}
            >
              {project.doneCount}
            </span>
          </div>
          <span className={styles.ProjectItemDate}>
            Created {formatDate(new Date(project.createdAt).getTime())}
          </span>
        </div>
        <div className={styles.ProjectItemRightPart}>
          <ProgressRing
            radius={36}
            stroke={3.5}
            progress={project.doneCount / (project.todoCount + project.pendingCount + project.doneCount) * 100}
          />
          <div className={styles.ProjectItemActions}>
            <button className={styles.ProjectItemAction}>
              <ShareIcon
                onClick={shareProject}
                height={20}
                width={20}
              />
            </button>
            {!readOnly && (
              <button className={styles.ProjectItemAction}>
                <RemoveIcon
                  onClick={removeProject}
                  height={20}
                  width={20}
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect((state) => ({
  app: state.app
}))(ProjectItem);