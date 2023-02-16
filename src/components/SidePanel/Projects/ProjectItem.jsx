import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as appActions from "../../../actions/app";
import ListItem from "../../UI/ListItem";

const ProjectItem = (props) => {
  const {
    project,
    listeners,
  } = props;
  const dispatch = useDispatch();
  const selectedProject = useSelector(state => state.app.selectedProject);
  const selectProject = (id) => {
    if (selectedProject !== project.id) {
      dispatch(appActions.handleSetProject(id));
    }
  };
  return (
    <ListItem
      id={project.id}
      primaryLabel={project.title || "Untitled Project"}
      secondaryLabel={project.permalink}
      onSelect={selectProject}
      selected={selectedProject === project.id}
      listeners={listeners}
    />
  );
};

export default ProjectItem;
