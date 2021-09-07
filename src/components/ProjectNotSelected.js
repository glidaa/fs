import React from 'react';
import styledComponents from "styled-components"
import { connect } from "react-redux";
import * as appActions from "../actions/app"
import * as projectsActions from "../actions/projects"
import { initProjectState, OK } from "../constants"
import parseLinkedList from "../utils/parseLinkedList"
import { ReactComponent as NotFoundIllustartion } from "../assets/undraw_empty_xct9.svg"
import { ReactComponent as TasksIllustartion} from "../assets/undraw_Add_notes_re_ln36.svg"
import filterObj from '../utils/filterObj';
import { useParams } from "react-router-dom"
import { panelPages } from "../constants"

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
    <ProjectNotSelectedContainer>
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
    </ProjectNotSelectedContainer>
  )
}

const ProjectNotSelectedContainer = styledComponents.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  gap: 40px;
  & > svg {
    width: 360px;
    height: auto;
  }
  & > div {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 10px;
    & > span {
      font-weight: bold;
      font-size: 28px;
      color: #222222;
    }
    & > button {
      color: #006EFF;
      background-color: #CCE2FF;
      border-radius: 8px;
      max-width: fit-content;
      outline: none;
      border: none;
      cursor: pointer;
      padding: 5px 10px;
      font-weight: 600;
      font-size: 18px;
    }
  }
  @media only screen and (max-width: 768px) {
    position: absolute;
    & > svg {
      width: 240px;
    }
    & > div {
      & > span {
        font-size: 20px;
      }
      & > button {
        font-size: 16px;
      }
    }
  }
`

export default connect((state) => ({
	user: state.user,
	app: state.app,
	projects: state.projects
}))(ProjectNotSelected);