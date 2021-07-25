import React, { useState } from "react"
import styledComponents from "styled-components";
import {
  closestCenter,
  DndContext,
  LayoutMeasuringStrategy,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor
} from '@dnd-kit/core';
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToFirstScrollableAncestor
} from '@dnd-kit/modifiers';
import {CSS} from '@dnd-kit/utilities';
import { connect } from "react-redux";
import * as projectsActions from "../actions/projects"
import * as appActions from "../actions/app"
import ProjectItem from "./ProjectItem"
import { AuthState } from '@aws-amplify/ui-components';
import { initProjectState, OK, PENDING } from "../constants"
import parseLinkedList from "../utils/parseLinkedList"
import { ReactComponent as BackArrowIcon } from "../assets/chevron-back-outline.svg";
import { ReactComponent as AddIcon } from "../assets/add-outline.svg";
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

const Sortable = (props) => {

  const {
    items,
    children,
    onDragEnd
  } = props

  const [activeId, setActiveId] = useState(null);
  const getIndex = items.indexOf.bind(items);
  const activeIndex = activeId ? getIndex(activeId) : -1;
  const activationConstraint = {
    delay: 250,
    tolerance: 5,
  }
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint,
    }),
    useSensor(TouchSensor, {
      activationConstraint,
    })
  );

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={({active}) => {
        if (!active) {
          return;
        }
        setActiveId(active.id);
      }}
      onDragEnd={({over}) => {
        setActiveId(null);
        if (over) {
          const overIndex = getIndex(over.id);
          if (activeIndex !== overIndex) {
            onDragEnd(activeIndex, overIndex);
          }
        }
      }}
      onDragCancel={() => setActiveId(null)}
      sensors={sensors}
      layoutMeasuring={{strategy: LayoutMeasuringStrategy.Always}}
      modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
    >
      <div>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div>
            {children}
          </div>
        </SortableContext>
      </div>
    </DndContext>
  );
}

const SortableItem = (props) => {

  const {
    index,
    value,
    readOnly
  } = props

  const {
    isSorting,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: value.id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
    >
      <ProjectItem
        key={index}
        project={value}
        readOnly={readOnly}
        isSorting={isSorting}
        isDragging={isDragging}
        listeners={listeners}
      />
    </div>
  );
}

const ProjectsPanel = (props) => {
	const {
    user,
    app: {
      projectAddingStatus,
      isProjectsPanelOpened
    },
    projects,
    dispatch
  } = props
	const [scope, setScope] = useState("owned")
	const onSortEnd = ({oldIndex, newIndex}) => {
		if (oldIndex > newIndex) {
		const sortedProjects = parseLinkedList(projects["owned"], "prevProject", "nextProject")
			dispatch(projectsActions.handleUpdateProject({
				id: sortedProjects[oldIndex].id,
				prevProject: sortedProjects[newIndex - 1]?.id || null,
				nextProject:  sortedProjects[newIndex]?.id || null,
			}))
		} else if (oldIndex < newIndex) {
			const sortedProjects = parseLinkedList(projects["owned"], "prevProject", "nextProject")
			dispatch(projectsActions.handleUpdateProject({
				id: sortedProjects[oldIndex].id,
				prevProject: sortedProjects[newIndex]?.id || null,
				nextProject:  sortedProjects[newIndex + 1]?.id || null,
			}))
		}
	};
  const createNewProject = () => {
    projectAddingStatus === OK &&
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
  const closePanel = () => {
    dispatch(appActions.handleSetProjectsPanel(false))
  }
	return (
    <ProjectsPanelShell open={isProjectsPanelOpened}>
      <ProjectsPanelContainer>
        <ProjectsPanelToolbar>
          <ProjectsPanelToolbarAction onClick={closePanel}>
            <BackArrowIcon
                width="24"
                height="24"
                strokeWidth="32"
                color="#006EFF"
            />
          </ProjectsPanelToolbarAction>
          <ProjectsPanelTitle>Projects</ProjectsPanelTitle>
          <ProjectsPanelToolbarAction
            onClick={createNewProject}
            isInactive={projectAddingStatus === PENDING}
          >
            <AddIcon
                width="24"
                height="24"
                strokeWidth="32"
                color="#006EFF"
            />
          </ProjectsPanelToolbarAction>
        </ProjectsPanelToolbar>
        {user.state === AuthState.SignedIn && <PanelTabs>
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
        </PanelTabs>}
        <ProjectItems>
          {scope === "assigned" ? (
            <>
              {Object.values(projects[scope]).map(project => (
                <ProjectItem
                  key={project.id}
                  project={project}
                  readOnly={true}
                />
              ))}
            </>
          ) : (
            <Sortable
              items={parseLinkedList(projects, "prevProject", "nextProject").map(({ id }) => id)}
              onDragEnd={onSortEnd}
            >
              {parseLinkedList(projects[scope], "prevProject", "nextProject").map((value, index) => (
                <SortableItem
                  key={value.id}
                  index={index}
                  value={value}
                />
              ))}
            </Sortable>
          )}
        </ProjectItems>
      </ProjectsPanelContainer>
    </ProjectsPanelShell>
	);  
}

const ProjectsPanelShell = styledComponents.div`
	background-color: #FFFFFF;
  border-radius: 0 35px 35px 0;
  flex: 1;
	height: 100vh;
  transition: all 0.2s ease;
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(-100%)")};
  max-width: ${({ open }) => (open ? "100vw" : "0px")};
  overflow: ${({ open }) => (open ? "auto" : "hidden")};
  @media only screen and (max-width: 768px) {
    position: fixed;
    width: 100vw;
    max-width: 100vw;
  }
  -webkit-touch-callout: none;
  -webkit-user-select: none;
   -khtml-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none; 
          user-select: none;
`;

const ProjectsPanelContainer = styledComponents.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  height: 100vh;
`;

const ProjectsPanelToolbar = styledComponents.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 25px;
  padding-top: 25px;
`

const ProjectsPanelTitle = styledComponents.span`
  color: #000000;
  font-size: 1.5em;
  font-weight: 600;
`

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

const ProjectsPanelToolbarAction = styledComponents.button`
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
}))(ProjectsPanel);