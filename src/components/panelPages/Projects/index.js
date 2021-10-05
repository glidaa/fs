import React, { useState } from "react"
import styledComponents from "styled-components";
import { connect } from "react-redux";
import * as projectsActions from "../../../actions/projects"
import * as appActions from "../../../actions/app"
import { initProjectState, OK, PENDING, AuthState } from "../../../constants"
import parseLinkedList from "../../../utils/parseLinkedList"
import { ReactComponent as BackArrowIcon } from "../../../assets/chevron-back-outline.svg";
import { ReactComponent as AddIcon } from "../../../assets/add-outline.svg";
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import filterObj from "../../../utils/filterObj";
import PanelTabs from "../../PanelTabs";
import Assigned from "./Assigned";
import Watched from "./Watched";
import Owned from "./Owned";

const Projects = (props) => {
  const {
    user,
    app: {
      projectAddingStatus
    },
    projects,
    dispatch
  } = props
  const [scope, setScope] = useState("owned")
  const createNewProject = () => {
    if (projectAddingStatus === OK) {
      dispatch(appActions.handleSetLeftPanel(false))
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
  }
  const closePanel = () => {
    dispatch(appActions.handleSetLeftPanel(false))
  }
  return (
    <>
      <PanelPageContainer>
        <PanelPageToolbar>
          <PanelPageToolbarAction onClick={closePanel}>
            <BackArrowIcon
              width={24}
              height={24}
              strokeWidth={32}
              color="#006EFF"
            />
          </PanelPageToolbarAction>
          <PanelPageTitle>Projects</PanelPageTitle>
          <PanelPageToolbarAction
            onClick={createNewProject}
            isInactive={projectAddingStatus === PENDING}
          >
            <AddIcon
              width={24}
              height={24}
              strokeWidth={32}
              color="#006EFF"
            />
          </PanelPageToolbarAction>
        </PanelPageToolbar>
        {user.state === AuthState.SignedIn && (
          <PanelTabs
            tabs={[
              ["owned", "Owned"],
              ["assigned", "Assigned"],
              ["watched", "Watched"]
            ]}
            value={scope}
            onChange={(newVal) => setScope(newVal)}
          />
        )}
        <ProjectItems>
          {scope === "assigned" && <Assigned />}
          {scope === "watched" && <Watched />}
          {scope === "owned" && <Owned />}
        </ProjectItems>
      </PanelPageContainer>
    </>
  );  
}

const PanelPageContainer = styledComponents.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  height: 100vh;
`;

const PanelPageToolbar = styledComponents.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 25px;
  padding-top: 25px;
`

const PanelPageTitle = styledComponents.span`
  color: #000000;
  font-size: 18px;
  font-weight: 600;
`

const ProjectItems = styledComponents(SimpleBar)`
  flex: 1;
  overflow: auto;
  height: 0;
  min-height: 0;
  & .simplebar-content > div > div {
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
    padding-bottom: 25px;
  }
`;

const PanelPageToolbarAction = styledComponents.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  background-color: transparent;
  cursor: pointer;
`

export default connect((state) => ({
  user: state.user,
  app: state.app,
  projects: state.projects
}))(Projects);