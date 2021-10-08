import React, { useMemo } from "react"
import { connect } from "react-redux"
import styled from "styled-components";
import ProjectItem from "../../ProjectItem"
import { ReactComponent as NoWatchedIllustartion } from "../../../assets/undraw_Surveillance_re_8tkl.svg"

const Projects = (props) => {
  const {
    projects
  } = props
  const getWatchedProjects = (projects) => {
    return Object.values(projects).filter(x => x.isWatched)
  }
  const watchedProjects = useMemo(() => getWatchedProjects(projects), [projects])
  return (
    <div>
      {watchedProjects.length ? watchedProjects.map(project => (
        <div key={project.id}>
          <ProjectItem
            project={project}
            readOnly={false}
          />
        </div>
      )) : (
        <NoWatchedProjects>
          <NoWatchedIllustartion />
          <span>
            No Projects Watched By You
          </span>
        </NoWatchedProjects>
      )}
    </div>
  );  
}

const NoWatchedProjects = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 40px;
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
    color: #000000;
    margin-top: 25px;
  }
`

export default connect((state) => ({
  user: state.user,
  app: state.app,
  projects: state.projects
}))(Projects);