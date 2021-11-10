import React, { useMemo } from "react"
import { connect } from "react-redux"
import styles from "./Watched.module.scss";
import ProjectItem from "./ProjectItem"
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
            readOnly={true}
          />
        </div>
      )) : (
        <div className={styles.NoWatchedProjects}>
          <NoWatchedIllustartion />
          <span>
            No Projects Watched By You
          </span>
        </div>
      )}
    </div>
  );  
}

export default connect((state) => ({
  user: state.user,
  app: state.app,
  projects: state.projects
}))(Projects);