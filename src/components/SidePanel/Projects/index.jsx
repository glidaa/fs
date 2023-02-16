import React, { forwardRef, useImperativeHandle, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import * as projectsActions from "../../../actions/projects"
import * as appActions from "../../../actions/app"
import { initProjectState, AuthState, ThingStatus } from "../../../constants"
import sortByRank from "../../../utils/sortByRank"
import { ReactComponent as AddIcon } from "@fluentui/svg-icons/icons/add_24_regular.svg";
import filterObj from "../../../utils/filterObj";
import PanelTabs from "../../UI/PanelTabs";
import Assigned from "./Assigned";
import Watched from "./Watched";
import Owned from "./Owned";
import generateRank from "../../../utils/generateRank";

const Projects = forwardRef((_, ref) => {
  const [scope, setScope] = useState("owned")
  const dispatch = useDispatch();

  const isSynced = useSelector(state => state.app.isSynced);

  const userState = useSelector(state => state.user.state);

  const projectsStatus = useSelector(state => state.status.projects);

  const projects = useSelector(state => state.projects);

  const createNewProject = async () => {
    if (projectsStatus === ThingStatus.READY) {
      const ownedProjects = filterObj(projects, (x) => x.isOwned);
      dispatch(
        projectsActions.handleCreateProject(
          await initProjectState(
            generateRank(sortByRank(
                ownedProjects,
                true
              )[0]?.rank
            ),
            Object.keys(ownedProjects)
          )
        )
      );
    }
  }
  const closePanel = () => {
    dispatch(appActions.handleSetLeftPanel(false))
  }
  useImperativeHandle(ref, () => ({
    panelProps: {
      title: "Projects",
      actionIcon: isSynced ? AddIcon : null,
      header: userState === AuthState.SignedIn && (
        <center>
          <PanelTabs
            tabs={[
              ["owned", "Owned"],
              ["assigned", "Assigned"],
              ["watched", "Watched"],
            ]}
            value={scope}
            onChange={(newVal) => setScope(newVal)}
          />
        </center>
      ),
      onClose: () => {
        closePanel();
      },
      onAction: () => {
        createNewProject();
      },
    },
  }));
  return scope === "assigned" ? (
    <Assigned />
  ) : scope === "watched" ? (
    <Watched />
  ) : scope === "owned" ? (
    <Owned />
  ) : null;
    
})

Projects.displayName = "Projects"

export default Projects;