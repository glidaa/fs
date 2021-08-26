import React from 'react';
import styledComponents from "styled-components"
import { connect } from "react-redux";
import * as projectsActions from "../actions/projects"
import { initProjectState, OK, PENDING } from "../constants"
import parseLinkedList from "../utils/parseLinkedList"
import tasksIllustartion from "../assets/undraw_Add_notes_re_ln36.svg"
import filterObj from '../utils/filterObj';

const ProjectNotSelected = (props) => {
  const { app: { projectAddingStatus }, projects, dispatch } = props
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
  return (
    <ProjectNotSelectedContainer>
      <img alt="Tasks Illustration" src={tasksIllustartion} />
      <span onClick={createNewProject}>Select A Project To Get Started</span>
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
  & > img {
    width: 50%;
  }
  & > span {
    font-weight: bold;
    font-size: 1.2em;
    color: #222222;
  }
`

export default connect((state) => ({
	user: state.user,
	app: state.app,
	projects: state.projects
}))(ProjectNotSelected);