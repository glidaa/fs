import React from 'react';
import styledComponents from "styled-components";
import * as appActions from "../actions/app"
import { connect } from "react-redux";
import ShareBtn from "./ShareBtn";
import PasteBtn from "./PasteBtn";
import useWindowSize from "../utils/useWindowSize";
import { ReactComponent as MenuIcon } from "../assets/menu-outline.svg";

const TasksPanel = (props) => {
  const {
    app,
    projects,
    dispatch
  } = props;
  let { width } = useWindowSize();
  const openProjectsPanel = () => {
    dispatch(appActions.handleSetProjectsPanel(true))
  }
  return (
    <ToolbarContainer>
      <LeftControls>
        <ToolbarAction onClick={openProjectsPanel}>
          <MenuIcon
              width="24"
              height="24"
              strokeWidth="32"
              color="#222222"
          />
        </ToolbarAction>
      </LeftControls>
      <RightControls>
        <ShareBtn isTask={false} />
        {Object.keys(projects.owned).includes(app.selectedProject) && (
          <PasteBtn />
        )}
      </RightControls>
    </ToolbarContainer>
  );
};

const ToolbarContainer = styledComponents.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px 0 12px;
	@media only screen and (max-width: 768px) {
		padding: 15px 20px 0 20px;
	}
`;

const LeftControls = styledComponents.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RightControls = styledComponents.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ToolbarAction = styledComponents.button`
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
  tasks: state.tasks,
  app: state.app,
  projects: state.projects,
}))(TasksPanel);
