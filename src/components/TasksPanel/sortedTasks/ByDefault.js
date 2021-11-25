import React, {useState, useMemo} from 'react';
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
import { CSS } from '@dnd-kit/utilities';
import { connect } from "react-redux";
import parseLinkedList from "../../../utils/parseLinkedList";
import TaskItem from "../TaskItem";
import * as tasksActions from "../../../actions/tasks";
import { AuthState } from "../../../constants";

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
        if (!active) return;
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
    setHideShow,
    sortable,
    nextTask,
    prevTask
  } = props

  const {
    isSorting,
    isDragging,
    listeners,
    transform,
    transition,
    setNodeRef,
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
      <TaskItem
        key={index}
        item={value}
        setHideShow={setHideShow}
        isSorting={isSorting}
        isDragging={isDragging}
        listeners={listeners}
        nextTask={nextTask}
        prevTask={prevTask}
      />
    </div>
  );
}

const ByDefault = (props) => {
  const {
    app: {
      selectedProject,
      isSynced
    },
    tasks,
    projects,
    user,
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
  const getReadOnly = (user, projects, selectedProject, isSynced) => {
    return user.state === AuthState.SignedIn &&
    ((projects[selectedProject]?.owner !== user.data.username &&
    projects[selectedProject]?.permissions === "r") || !isSynced)
  }
  const readOnly = useMemo(() => getReadOnly(user, projects, selectedProject, isSynced), [user, projects, selectedProject, isSynced])
  const getSortedTasks = (tasks) => parseLinkedList(tasks, "prevTask", "nextTask")
  const sortedTasks = useMemo(() => getSortedTasks(tasks), [tasks])
  return (
    <Sortable
      items={parseLinkedList(tasks, "prevTask", "nextTask").map(({ id }) => id)}
      onDragEnd={onSortEnd}
    >
      {sortedTasks.map((value, index) => (
        <SortableItem
          key={value.id}
          index={index}
          value={value}
          nextTask={value.nextTask}
          prevTask={value.prevTask}
          sortable={!readOnly}
        />
      ))}
    </Sortable>
  )
}

export default connect((state) => ({
  tasks: state.tasks,
  app: state.app,
  projects: state.projects,
  user: state.user
}))(ByDefault);
