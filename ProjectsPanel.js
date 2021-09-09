import { useState, useEffect } from "react";
import styledComponents from "styled-components";
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import { connect } from "react-redux";
import * as projectsActions from "../actions/projects";
import ProjectItem from "./ProjectItem";
import { AuthState } from "@aws-amplify/ui-components";
import { initProjectState, OK, PENDING } from "../constants";
import parseLinkedList from "../utils/parseLinkedList";
import useWindowSize from "../utils/useWindowSize";

const DragHandle = sortableHandle(() => <ProjectHandler />);

const SortableItem = sortableElement(({ index, value }) => (
  <ProjectItem key={index} project={value} handler={<DragHandle />} />
));

const SortableContainer = sortableContainer(({ children }) => {
  return <div>{children}</div>;
});

const ProjectsPanel = (props) => {
  const {
    user,
    app,
    projects,
    dispatch,
    setHideShowProjectPanel,
    projectPanel,
  } = props;
  let { width } = useWindowSize();
  const [scope, setScope] = useState("owned");
  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex > newIndex) {
      const sortedProjects = parseLinkedList(
        projects["owned"],
        "prevProject",
        "nextProject"
      );
      dispatch(
        projectsActions.handleUpdateProject({
          id: sortedProjects[oldIndex].id,
          prevProject: sortedProjects[newIndex - 1]?.id || null,
          nextProject: sortedProjects[newIndex]?.id || null,
        })
      );
    } else if (oldIndex < newIndex) {
      const sortedProjects = parseLinkedList(
        projects["owned"],
        "prevProject",
        "nextProject"
      );
      dispatch(
        projectsActions.handleUpdateProject({
          id: sortedProjects[oldIndex].id,
          prevProject: sortedProjects[newIndex]?.id || null,
          nextProject: sortedProjects[newIndex + 1]?.id || null,
        })
      );
    }
  };
  const loadDataOnlyOnce = async () => {
    try {
      if (
        app.projectAddingStatus === OK &&
        Object.keys(projects.owned).length === 0
      ) {
        let initProject = initProjectState(
          parseLinkedList(
            projects["owned"],
            "prevProject",
            "nextProject"
          ).reverse()[0]?.id
        );
        await dispatch(projectsActions.handleCreateProject(initProject));
        await dispatch(appActions.handleSetProject(initProject.id));
      }
    } catch (err) {
      console.log("err when initial project", err);
    }
  };
  useEffect(() => {
    loadDataOnlyOnce();
  }, []);

  return (
    <Panel open={projectPanel} data-testid="sidePanel">
      {width <= 768 && (
        <Button data-testid="close" onClick={() => setHideShowProjectPanel()}>
          X
        </Button>
      )}
      {user.state === AuthState.SignedIn && (
        <PanelTabs>
          <div>
            <span
              className={scope === "owned" ? "active" : null}
              onClick={() => scope !== "owned" && setScope("owned")}
            >
              Owned
            </span>
            <span
              className={scope === "assigned" ? "active" : null}
              onClick={() => scope !== "assigned" && setScope("assigned")}
            >
              Assigned
            </span>
          </div>
        </PanelTabs>
      )}
      <ProjectItems>
        {scope === "assigned" ? (
          <>
            {Object.values(projects[scope]).map((project) => (
              <ProjectItem key={project.id} project={project} readOnly={true} />
            ))}
          </>
        ) : (
          <SortableContainer onSortEnd={onSortEnd} lockAxis="y" useDragHandle>
            {parseLinkedList(projects[scope], "prevProject", "nextProject").map(
              (value, index) => (
                <SortableItem key={value.id} index={index} value={value} />
              )
            )}
          </SortableContainer>
        )}
      </ProjectItems>
      {scope === "owned" && (
        <ProjectAdder isInactive={app.projectAddingStatus === PENDING}>
          <span
            onClick={() =>
              app.projectAddingStatus === OK &&
              dispatch(
                projectsActions.handleCreateProject(
                  initProjectState(
                    parseLinkedList(
                      projects["owned"],
                      "prevProject",
                      "nextProject"
                    ).reverse()[0]?.id
                  )
                )
              )
            }
          >
            +
          </span>
        </ProjectAdder>
      )}
    </Panel>
  );
};

const Button = styledComponents.button`
background: none;
border: none;
font-size: 14px;
font-weight: 600;
position: absolute;
top: 1%;
right: 4px;
`;

const Panel = styledComponents.div`
	background-color: #FFFFFF;
	flex: 2;
	height: 100vh;
	display: flex;
	flex-direction: column;
	box-shadow: 0px 0px 8px 1px #dadada;
	top: 0;
	left: 0;
	& > span {
		font-weight: 600;
		cursor: pointer;
	}
	@media only screen and (max-width: 768px) {
		flex-direction: column;
		height: 100vh;
		text-align: left;
		padding: 0;
		position: absolute;
		top: 0;
		left: 0;
		transition: transform 0.3s ease-in-out;
		transform: ${({ open }) => (open ? "translateX(0)" : "translateX(-100%)")};
		z-index: 1;
    min-width: 300px;
	}
`;

const ProjectHandler = styledComponents.div`
	background-color: #00000050;
	width: 8px;
`;

const PanelTabs = styledComponents.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 90px;
	& > div {
		display: flex;
		flex-direction: row;
		gap: 5px;
		padding: 5px;
		background-color: #BDBDBD;
		border-radius: 24px;
		height: fit-content;
		width: fit-content;
		& > span {
			border-radius: 24px;
			padding: 2px 10px;
			font-weight: 600;
			display: flex;
			justify-content: center;
			background-color: transparent;
			color: #FFFFFF;
			cursor: pointer;
			&.active {
				color: #222222;
				background-color: #FFFFFF;
				cursor: default;
			}
		}
	}
`;

const ProjectItems = styledComponents.div`
	overflow-y: auto;
	padding: 10px 0;
	flex: 1;
	& > div:last-child > div {
		border-bottom: 1px solid #E4E4E2;
	}

  @media only screen and (max-width: 768px) {
	padding: 30px 0;
  overflow: unset;
	}
`;

const ProjectAdder = styledComponents.div`
	padding: 10px;
	& > span {
		height: 20px;
		float: right;
		font-size: 1.5em;
		width: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 5px;
		border-radius: 4px;
		font-weight: bold;
		transition: background-color 0.3s;
		${({ isInactive }) =>
      isInactive
        ? `
		color: #D3D3D3;
		`
        : `
		cursor: pointer;
		color: #222222;
		&:hover {
			background-color: #E4E4E2;
		}
	`}
	}
`;

export default connect((state) => ({
  user: state.user,
  app: state.app,
  projects: state.projects,
}))(ProjectsPanel);
