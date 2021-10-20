import React, { useState } from "react"
import themes from "../../../themes"
import styles from "./index.module.scss"
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
    appSettings,
    dispatch
  } = props
  const theme = themes[appSettings.theme];
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
      <div className={styles.PanelPageContainer}>
        <div className={styles.PanelPageToolbar}>
          <button
            className={styles.PanelPageToolbarAction}
            onClick={closePanel}
          >
            <BackArrowIcon
              width={24}
              height={24}
              strokeWidth={32}
              color={theme.primary}
            />
          </button>
          <span className={styles.PanelPageTitle}>
            Projects
          </span>
          <button
            className={styles.PanelPageToolbarAction}
            onClick={createNewProject}
          >
            <AddIcon
              width={24}
              height={24}
              strokeWidth={32}
              color={theme.primary}
            />
          </button>
        </div>
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
        <CustomScroller className={styles.ProjectItems}>
          {scope === "assigned" && <Assigned />}
          {scope === "watched" && <Watched />}
          {scope === "owned" && <Owned />}
        </CustomScroller>
      </div>
    </>
  );  
}

export default connect((state) => ({
  user: state.user,
  app: state.app,
  projects: state.projects,
  appSettings: state.appSettings
}))(Projects);