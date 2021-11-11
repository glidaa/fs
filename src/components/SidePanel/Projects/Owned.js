import React, { useState } from "react"
import {
  closestCenter,
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  MeasuringStrategy
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
import * as projectsActions from "../../../actions/projects"
import ProjectItem from "./ProjectItem"
import parseLinkedList from "../../../utils/parseLinkedList"
import filterObj from "../../../utils/filterObj";

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
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always
        }
      }}
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
    sortable
  } = props

  const {
    isSorting,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: value.id, disabled: !sortable});

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
        readOnly={!sortable}
        isSorting={isSorting}
        isDragging={isDragging}
        listeners={listeners}
      />
    </div>
  );
}

const Owned = (props) => {
  const {
    app: {
      isSynced
    },
    projects,
    dispatch
  } = props
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
  return (
    <Sortable
      items={parseLinkedList(filterObj(projects, x => x.isOwned), "prevProject", "nextProject").map(({ id }) => id)}
      onDragEnd={onSortEnd}
    >
      {parseLinkedList(filterObj(projects, x => x.isOwned), "prevProject", "nextProject").map((value, index) => (
        <SortableItem
          key={value.id}
          index={index}
          value={value}
          sortable={isSynced}
        />
      ))}
    </Sortable>
  );  
}

export default connect((state) => ({
    user: state.user,
    app: state.app,
    projects: state.projects
}))(Owned);