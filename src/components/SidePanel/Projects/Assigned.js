import React, { useMemo } from "react"
import { connect } from "react-redux"
import styled from "styled-components";
import ProjectItem from "../../ProjectItem"
import { ReactComponent as NoAssignedIllustartion } from "../../../assets/undraw_accept_tasks_po1c.svg"

const Projects = (props) => {
  const {
    projects
  } = props
  const getAssignedProjects = (projects) => {
    return Object.values(projects).filter(x => x.isAssigned)
  }
  const assignedProjects = useMemo(() => getAssignedProjects(projects), [projects])
  return (
    <div>
      {assignedProjects.length ? assignedProjects.map(project => (
        <div key={project.id}>
          <ProjectItem
            project={project}
            readOnly={false}
          />
        </div>
      )) : (
        <NoAssignedProjects>
          <NoAssignedIllustartion />
          <span>
            No Projects Assigned To You
          </span>
        </NoAssignedProjects>
      )}
    </div>
  );  
}

const NoAssignedProjects = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin-top: -25px;
  width: 100%;
  & > svg {
    width: 250px;
    height: auto;
    margin-top: 25px;
  }
  & > span {
    font-weight: bold;
    font-size: 18px;
    color: #222222;
    margin-top: 25px;
  }
  & > *:not(:last-child) {
    margin-bottom: 40px;
  }
`

export default connect((state) => ({
  user: state.user,
  app: state.app,
  projects: state.projects
}))(Projects);