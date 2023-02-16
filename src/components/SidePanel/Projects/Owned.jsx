import React, { useState, useMemo } from "react"
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
import { useDispatch, useSelector } from "react-redux";
import * as projectsActions from "../../../actions/projects"
import ProjectItem from "./ProjectItem"
import sortByRank from "../../../utils/sortByRank"
import generateRank from "../../../utils/generateRank"
import filterObj from "../../../utils/filterObj";
import { ReactComponent as NoOwnedIllustartion } from "../../../assets/undraw_businessman_re_mlee.svg"
import Illustration from "../../UI/Illustration";

const Sortable = (props) => {

  const {
    items,
    children,
    onDragEnd
  } = props

  const [activeId, setActiveId] = useState(null);
  const getIndex = items.indexOf.bind(items);
  const activeIndex = activeId ? getIndex(activeId) : -1;
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
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
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
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

const Owned = () => {
  const dispatch = useDispatch();

  const isSynced = useSelector(state => state.app.isSynced);

  const projects = useSelector(state => state.projects);

  const onSortEnd = ({oldIndex, newIndex}) => {
    if (oldIndex > newIndex) {
        const sortedProjects = sortByRank(filterObj(projects, x => x.isOwned))
        dispatch(projectsActions.handleUpdateProject({
          id: sortedProjects[oldIndex].id,
          rank: generateRank(sortedProjects[newIndex - 1]?.rank, sortedProjects[newIndex]?.rank),
        }))
      } else if (oldIndex < newIndex) {
        const sortedProjects = sortByRank(filterObj(projects, x => x.isOwned))
        dispatch(projectsActions.handleUpdateProject({
          id: sortedProjects[oldIndex].id,
          rank: generateRank(sortedProjects[newIndex]?.rank, sortedProjects[newIndex + 1]?.rank),
        }))
    }
  };
  const getOwnedProjects = (projects) => {
    return sortByRank(filterObj(projects, x => x.isOwned))
  }
  const ownedProjects = useMemo(() => getOwnedProjects(projects), [projects])
  return ownedProjects.length ? (
    <Sortable
      items={ownedProjects.map(({ id }) => id)}
      onDragEnd={onSortEnd}
    >
      {ownedProjects.map((value, index) => (
        <SortableItem
          key={value.id}
          index={index}
          value={value}
          sortable={isSynced}
        />
      ))}
    </Sortable>
  ) : (
    <Illustration
      illustration={NoOwnedIllustartion}
      title="No Projects Owned By You"
      secondary
    />
  );  
}

export default Owned;