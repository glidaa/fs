import React, { useMemo } from "react"
import { connect } from "react-redux"
import styles from "./Assigned.module.scss";
import ProjectItem from "./ProjectItem"
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
            readOnly={true}
          />
        </div>
      )) : (
        <div className={styles.NoAssignedProjects}>
          <NoAssignedIllustartion />
          <span>
            No Projects Assigned To You
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