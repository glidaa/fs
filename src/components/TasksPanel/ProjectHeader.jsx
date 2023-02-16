import React from "react"
import * as appSettingsActions from "../../actions/appSettings"
import { useSelector, useDispatch } from "react-redux";
import styles from "./ProjectHeader.module.scss"
import ProjectTitle from "./ProjectTitle"
import ComboBox from "../UI/fields/ComboBox";

const ProjectHeader = () => {
  const dispatch = useDispatch();

  const tasksSortingCriteria = useSelector(state => state.appSettings.tasksSortingCriteria);

  const handleChangeSortingCriteria = (e) => {
    dispatch(
      appSettingsActions.handleSetTasksSortingCriteria(
        e.target.value
      )
    )
  }

  return (
    <div className={styles.ProjectHeader}>
      <ProjectTitle />
      <div className={styles.SortingSettings}>
        <ComboBox
          onChange={handleChangeSortingCriteria}
          value={tasksSortingCriteria}
          options={[
            ["BY_DEFAULT", "by default"],
            ["BY_DUE", "by due"],
            ["BY_STATUS", "by status"],
            ["BY_PRIORITY", "by priority"],
            ["BY_TAG", "by tag"]
          ]}
        />
      </div>
    </div>
  )
}

export default ProjectHeader;