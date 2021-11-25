import React from 'react';
import styles from "./ProjectNotSelected.module.scss"
import { connect } from "react-redux";
import * as appActions from "../../actions/app"
import * as projectsActions from "../../actions/projects"
import { panelPages, initProjectState, OK } from "../../constants"
import parseLinkedList from "../../utils/parseLinkedList"
import { ReactComponent as NotFoundIllustartion } from "../../assets/undraw_empty_xct9.svg"
import { ReactComponent as TasksIllustartion} from "../../assets/undraw_teamwork_hpdk.svg"
import filterObj from '../../utils/filterObj';
import { useParams } from "react-router-dom"

const ProjectNotSelected = (props) => {
  const {
    app: {
      projectAddingStatus
    },
    projects,
    dispatch
  } = props
  const params = useParams()
  const createNewProject = () => {
    projectAddingStatus === OK &&
    dispatch(
      projectsActions.handleCreateProject(
        initProjectState(
          parseLinkedList(
            filterObj(projects, x => x.isOwned),
            "prevProject",
            "nextProject"
          ).reverse()[0]?.id
        )
      )
    )
  }
  const openProjectsPanel = () => {
    dispatch(appActions.setLeftPanelPage(panelPages.PROJECTS))
    dispatch(appActions.handleSetLeftPanel(true))
  }
  return (
    <div className={styles.ProjectNotSelectedContainer}>
      {params.projectPermalink && <NotFoundIllustartion />}
      {!params.projectPermalink && <TasksIllustartion />}
      <div>
        <span>
          {params.projectPermalink && "Requested Project Not Found"}
          {!params.projectPermalink && "Create A Project To Get Started"}
        </span>
        {params.projectPermalink && <button onClick={openProjectsPanel}>My Projects</button>}
        {!params.projectPermalink && <button onClick={createNewProject}>+ Create New</button>}
      </div>
    </div>
  )
}

export default connect((state) => ({
	user: state.user,
	app: state.app,
	projects: state.projects
}))(ProjectNotSelected);