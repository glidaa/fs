import React, {useState} from 'react';
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
import styledComponents from "styled-components";
import { connect } from "react-redux";
import parseLinkedList from "../utils/parseLinkedList";
import TaskItem from "./TaskItem";
import ProjectNotSelected from "./ProjectNotSelected";
import * as tasksActions from "../actions/tasks";
import { OK, initTaskState } from "../constants";
import useWindowSize from "../utils/useWindowSize";
import ProjectTitle from './ProjectTitle';

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
    readOnly,
    setHideShow 
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
      <TaskItem
        key={index}
        item={value}
        readOnly={readOnly}
        setHideShow={setHideShow}
        isSorting={isSorting}
        isDragging={isDragging}
        listeners={listeners}
      />
    </div>
  );
}

const TasksPanel = (props) => {
  const {
    app: {
      selectedProject,
      taskAddingStatus
    },
    tasks,
    projects,
    dispatch,
  } = props;
  const onSortEnd = (oldIndex, newIndex) => {
    if (oldIndex > newIndex) {
      const sortedTasks = parseLinkedList(tasks, "prevTask", "nextTask");
      dispatch(
        tasksActions.handleUpdateTask({
          id: sortedTasks[oldIndex].id,
          prevTask: sortedTasks[newIndex - 1]?.id || null,
          nextTask: sortedTasks[newIndex]?.id || null,
        })
      );
    } else if (oldIndex < newIndex) {
      const sortedTasks = parseLinkedList(tasks, "prevTask", "nextTask");
      dispatch(
        tasksActions.handleUpdateTask({
          id: sortedTasks[oldIndex].id,
          prevTask: sortedTasks[newIndex]?.id || null,
          nextTask: sortedTasks[newIndex + 1]?.id || null,
        })
      );
    }
  };
  const addNewTask = (e) => {
    e.target.getAttribute("name") === "TasksPanelContainer" &&
    taskAddingStatus === OK &&
    dispatch(
      tasksActions.handleCreateTask(
        initTaskState(
          selectedProject,
          parseLinkedList(tasks, "prevTask", "nextTask").reverse()[0]?.id
        )
      )
    )
  }
  return (
    <TasksPanelContainer
      name="TasksPanelContainer"
      onClick={addNewTask}
    >
      {selectedProject ? (
        <>
          <TasksToolbar>
            <span>
              {projects[selectedProject].permalink}
            </span>
          </TasksToolbar>
          <ProjectTitle />
          <Sortable
            items={parseLinkedList(tasks, "prevTask", "nextTask").map(({ id }) => id)}
            onDragEnd={onSortEnd}
          >
            {parseLinkedList(tasks, "prevTask", "nextTask").map(
              (value, index) => (
                <SortableItem
                  key={value.id}
                  index={index}
                  value={value}
                  readOnly={false}
                />
              )
            )}
          </Sortable>
        </>
      ) : <ProjectNotSelected />}
    </TasksPanelContainer>
  );
};

const TasksPanelContainer = styledComponents.div`
  flex: 2;
  padding: 20px 40px 20px 40px;
  overflow: auto;
  background-color: #F8F8F8;
  min-height: calc(100vh - 80px);
  @media only screen and (max-width: 768px) {
		padding: 0px;
    background-color: #F4F7FF;
    width: 100%;
    height: 100%;
  }
`;

const TasksToolbar = styledComponents.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  & > span {
    font-size: 12px;
  }
	@media only screen and (max-width: 768px) {
		margin: 10px 0;
	}
`

export default connect((state) => ({
  tasks: state.tasks,
  app: state.app,
  projects: state.projects,
}))(TasksPanel);
