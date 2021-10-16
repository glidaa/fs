import React, { useState, useContext } from "react"
import styled, { ThemeContext } from "styled-components";
import { connect } from "react-redux";
import * as projectsActions from "../../../actions/projects"
import * as appActions from "../../../actions/app"
import { initProjectState, OK, PENDING, AuthState } from "../../../constants"
import parseLinkedList from "../../../utils/parseLinkedList"
import { ReactComponent as BackArrowIcon } from "../../../assets/chevron-back-outline.svg";
import { ReactComponent as AddIcon } from "../../../assets/add-outline.svg";
import CustomScroller from 'react-custom-scroller';
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
  const themeContext = useContext(ThemeContext);
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
              color={themeContext.primary}
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
              color={themeContext.primary}
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

const PanelPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  & > *:not(:last-child) {
    margin-bottom: 25px;
  }
`;

const PanelPageToolbar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 25px;
  padding-top: 25px;
`

const PanelPageTitle = styled.span`
  color: ${({theme})=> theme.txtColor};
  font-size: 18px;
  font-weight: 600;
`

const ProjectItems = styled(CustomScroller)`
  flex: 1;
  height: 0;
  min-height: 0;
  /* & div[class^="index-module_inner__"]-wrapper {
    min-height: 100%;
  } */
  & div[class^="index-module_inner__"] > div > div {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding-bottom: 25px;
    & > *:not(:last-child) {
      margin-bottom: 10px;
    }
  }
`;

const PanelPageToolbarAction = styled.button`
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