import React, { Fragment, useMemo } from "react";
import { useSelector } from "react-redux";
import ProjectItem from "./ProjectItem";
import { ReactComponent as NoWatchedIllustartion } from "../../../assets/undraw_Surveillance_re_8tkl.svg";
import Illustration from "../../UI/Illustration";

const Projects = (props) => {
  const projects = useSelector(state => state.projects);
  const getWatchedProjects = (projects) => {
    return Object.values(projects).filter((x) => x.isWatched);
  };
  const watchedProjects = useMemo(
    () => getWatchedProjects(projects),
    [projects]
  );
  return watchedProjects.length ? (
    watchedProjects.map((project) => (
      <Fragment key={project.id}>
        <ProjectItem project={project} readOnly />
      </Fragment>
    ))
  ) : (
    <Illustration
      illustration={NoWatchedIllustartion}
      title="No Projects Watched By You"
      secondary
    />
  );
};

export default Projects;
