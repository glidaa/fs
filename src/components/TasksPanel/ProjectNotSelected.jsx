import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as appActions from "../../actions/app";
import * as projectsActions from "../../actions/projects";
import { panelPages, initProjectState, ThingStatus } from "../../constants";
import { ReactComponent as NotFoundIllustartion } from "../../assets/undraw_empty_xct9.svg";
import { ReactComponent as TasksIllustartion } from "../../assets/undraw_teamwork_hpdk.svg";
import Illustration from "../UI/Illustration";
import { useRouterNoUpdates } from "../Router";
import generateRank from "../../utils/generateRank";

const ProjectNotSelected = () => {
  const { routeParams } = useRouterNoUpdates();
  const dispatch = useDispatch();

  const projectsStatus = useSelector(state => state.status.projects);

  const createNewProject = async () => {
    projectsStatus === ThingStatus.READY &&
      dispatch(
        projectsActions.handleCreateProject(
          await initProjectState(generateRank(), [])
        )
      );
  };
  const openProjectsPanel = () => {
    dispatch(appActions.setLeftPanelPage(panelPages.PROJECTS));
    dispatch(appActions.handleSetLeftPanel(true));
  };
  return (
    <Illustration
      illustration={
        routeParams.projectPermalink
          ? NotFoundIllustartion
          : TasksIllustartion
      }
      title={
        routeParams.projectPermalink
          ? "Requested Project Not Found"
          : "Create A Project To Get Started"
      }
      actionLabel={
        routeParams.projectPermalink
        ? "My Projects"
        : "+ Create New"
      }
      onAction={
        routeParams.projectPermalink
        ? openProjectsPanel
        : createNewProject
      }
    />
  );
};

export default ProjectNotSelected;
