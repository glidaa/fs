import React, { Fragment, useMemo } from "react";
import { useSelector } from "react-redux";
import ProjectItem from "./ProjectItem";
import { ReactComponent as NoAssignedIllustartion } from "../../../assets/undraw_Surveillance_re_8tkl.svg";
import Illustration from "../../UI/Illustration";

const Projects = () => {
  const projects = useSelector(state => state.projects);
  const getAssignedProjects = (projects) => {
    return Object.values(projects).filter((x) => x.isAssigned);
  };
  const assignedProjects = useMemo(
    () => getAssignedProjects(projects),
    [projects]
  );
  return assignedProjects.length ? (
    assignedProjects.map((project) => (
      <Fragment key={project.id}>
        <ProjectItem project={project} readOnly />
      </Fragment>
    ))
  ) : (
    <Illustration
      illustration={NoAssignedIllustartion}
      title="No Projects Assigned To You"
      secondary
    />
  );
};

export default Projects;