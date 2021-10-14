import React from 'react';
import styled from "styled-components"
import { connect } from "react-redux";
import * as appActions from "../../actions/app"
import * as projectsActions from "../../actions/projects"
import { panelPages, initProjectState, OK } from "../../constants"
import parseLinkedList from "../../utils/parseLinkedList"
import { ReactComponent as NotFoundIllustartion } from "../../assets/undraw_empty_xct9.svg"
import { ReactComponent as TasksIllustartion} from "../../assets/undraw_Add_notes_re_ln36.svg"
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

const ProjectNotSelectedContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
  & > svg {
    width: 360px;
    height: auto;
  }
  & > div {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    & > span {
      font-weight: bold;
      font-size: 28px;
      color: ${({theme})=> theme.txtColor};
    }
    & > button {
      color: ${({theme})=> theme.primary};
      background-color: ${({theme})=> theme.primaryLight};
      border-radius: 8px;
      max-width: fit-content;
      outline: none;
      border: none;
      cursor: pointer;
      padding: 5px 10px;
      font-weight: 600;
      font-size: 18px;
    }
    & > *:not(:last-child) {
      margin-bottom: 40px;
    }
    & > *:not(:last-child) {
      margin-bottom: 10px;
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