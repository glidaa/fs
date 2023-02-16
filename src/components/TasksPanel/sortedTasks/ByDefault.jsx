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
import { useDispatch, useSelector } from "react-redux";
import sortByRank from "../../../utils/sortByRank";
import TaskItem from "../TaskItem";
import * as tasksActions from "../../../actions/tasks";
import TaskPlaceholder from '../TaskPlaceholder';
import generateRank from '../../../utils/generateRank';
import { useReadOnly } from '../../ReadOnlyListener';

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

const ByDefault = () => {
  const dispatch = useDispatch();
  const readOnly = useReadOnly();

  const tasks = useSelector(state => state.tasks);

  const onSortEnd = (oldIndex, newIndex) => {
    if (oldIndex > newIndex) {
      const sortedTasks = sortByRank(tasks);
      dispatch(
        tasksActions.handleUpdateTask({
          id: sortedTasks[oldIndex].id,
          action: 'update',
          field: 'rank',
          value: generateRank(sortedTasks[newIndex - 1]?.rank, sortedTasks[newIndex]?.rank),
        })
      );
    } else if (oldIndex < newIndex) {
      const sortedTasks = sortByRank(tasks);
      dispatch(
        tasksActions.handleUpdateTask({
          id: sortedTasks[oldIndex].id,
          action: 'update',
          field: 'rank',
          value: generateRank(sortedTasks[newIndex]?.rank, sortedTasks[newIndex + 1]?.rank),
        })
      );
    }
  };
  const getSortedTasks = (tasks) => sortByRank(tasks)
  const sortedTasks = useMemo(() => getSortedTasks(tasks), [tasks])
  return (
    <>
      <Sortable
        items={sortByRank(tasks).map(({ id }) => id)}
        onDragEnd={onSortEnd}
      >
        {sortedTasks.map((value, index) => (
          <SortableItem
            key={value.id}
            index={index}
            value={value}
            nextTask={sortedTasks[index + 1]?.id || null}
            prevTask={sortedTasks[index - 1]?.id || null}
            sortable={!readOnly}
          />
        ))}
      </Sortable>
      <TaskPlaceholder />
    </>
  )
}

export default ByDefault;
