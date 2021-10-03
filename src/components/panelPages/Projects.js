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
import * as projectsActions from "../../actions/projects"
import * as appActions from "../../actions/app"
import ProjectItem from "../ProjectItem"
import { initProjectState, OK, PENDING, AuthState } from "../../constants"
import parseLinkedList from "../../utils/parseLinkedList"
import { ReactComponent as BackArrowIcon } from "../../assets/chevron-back-outline.svg";
import { ReactComponent as AddIcon } from "../../assets/add-outline.svg";
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import filterObj from "../../utils/filterObj";
import PanelTabs from "../PanelTabs";

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
	const onSortEnd = ({oldIndex, newIndex}) => {
		if (oldIndex > newIndex) {
		const sortedProjects = parseLinkedList(filterObj(projects, x => x.isOwned), "prevProject", "nextProject")
			dispatch(projectsActions.handleUpdateProject({
				id: sortedProjects[oldIndex].id,
				prevProject: sortedProjects[newIndex - 1]?.id || null,
				nextProject:  sortedProjects[newIndex]?.id || null,
			}))
		} else if (oldIndex < newIndex) {
			const sortedProjects = parseLinkedList(filterObj(projects, x => x.isOwned), "prevProject", "nextProject")
			dispatch(projectsActions.handleUpdateProject({
				id: sortedProjects[oldIndex].id,
				prevProject: sortedProjects[newIndex]?.id || null,
				nextProject:  sortedProjects[newIndex + 1]?.id || null,
			}))
		}
	};
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
          {scope === "assigned" ? (
            <div>
              {Object.values(projects).filter(x => x.isAssigned).map(project => (
                <div key={project.id}>
                  <ProjectItem
                    project={project}
                    readOnly={false}
                  />
                </div>
              ))}
            </div>
          ) : scope === "watched" ? (
            <div>
              {Object.values(projects).filter(x => x.isWatched).map(project => (
                <div key={project.id}>
                  <ProjectItem
                    project={project}
                    readOnly={false}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Sortable
              items={parseLinkedList(filterObj(projects, x => x.isOwned), "prevProject", "nextProject").map(({ id }) => id)}
              onDragEnd={onSortEnd}
            >
              {parseLinkedList(filterObj(projects, x => x.isOwned), "prevProject", "nextProject").map((value, index) => (
                <SortableItem
                  key={value.id}
                  index={index}
                  value={value}
                />
              ))}
            </Sortable>
          )}
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