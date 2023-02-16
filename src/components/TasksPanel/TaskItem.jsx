import React, { useRef, useMemo, useEffect, useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useWindowSize } from "../../components/WindowSizeListener";
import copyTaskCore from "../../utils/copyTask"
import generateRank from "../../utils/generateRank";
import * as appActions from "../../actions/app";
import * as tasksActions from "../../actions/tasks";
import { useModal } from "../ModalManager";
import { initTaskState, panelPages, ThingStatus } from "../../constants";
import modals from '../modals';
import Task from "../UI/Task";
import store from "../../store"
import { useReadOnly } from "../ReadOnlyListener";

const TaskItem = (props) => {

  const {
    item,
    nextTask,
    prevTask,
    listeners,
    isSorting,
    isDragging
  } = props;

  const { width } = useWindowSize();
  const { isModalOpened, showModal } = useModal();

  const inputRef = useRef(null)
  const dispatch = useDispatch()
  const readOnly = useReadOnly();
  
  const nextTaskRank = useSelector(state => state.tasks[nextTask]?.rank)
  const tasksStatus = useSelector(state => state.status.tasks)
  const isRightPanelOpened = useSelector(state => state.app.isRightPanelOpened)

  const showDueDate = useSelector(state => state.appSettings.showDueDate)
  const showAssignees = useSelector(state => state.appSettings.showAssignees)
  const showDoneIndicator = useSelector(state => state.appSettings.showDoneIndicator)
  const showCopyButton = useSelector(state => state.appSettings.showCopyButton)
  const showDuplicateButton = useSelector(state => state.appSettings.showDuplicateButton)
  const showShareButton = useSelector(state => state.appSettings.showShareButton)

  const isSelected = useSelector(state => state.app.selectedTask === item.id)
  const isLocked = useSelector(state => state.app.lockedTaskField && isSelected)
  const batchSelected = useSelector(state => state.app.selectedTasks?.includes(item.id))
  const isBatchSelecting = useSelector(state => state.app.selectedTasks != null)

  const users = useSelector(state => state.users)

  const selectedProject = useSelector(state => state.projects[item.projectId])

  const defaultStatus = useSelector(state => state.projects[item.projectId]?.defaultStatus);

  const isDefaultDone = useSelector(state => (
    state.projects[item.projectId]?.statusSet
      ?.filter(x => x.synonym === "done")
      ?.map(x => x.id)
      ?.includes(defaultStatus)
  ))

  const defaultOtherStatus = useSelector(state => (
    state.projects[item.projectId]?.statusSet
      ?.filter(x => isDefaultDone ? x.synonym !== "done" : x.synonym === "done")
      ?.[0]?.id
  ));

  const doneStatus = isDefaultDone ? defaultStatus : defaultOtherStatus;
  const notDoneStatus = isDefaultDone ? defaultOtherStatus : defaultStatus;

  const [shouldAutoFocus, setShouldAutoFocus] = useState(true)

  useEffect(() => {
    if (isSelected) {
      setTimeout(() => {
        if (!(isRightPanelOpened || isModalOpened)) {
          inputRef.current?.focus()
        } else {
          inputRef.current?.blur()
        }
      }, 0)
    }
  }, [isRightPanelOpened, isModalOpened, isSelected])

  const processAssingees = (value, users) => {
    const result = []
    for (const assigneeId of value.assignees) {
      result.push({...users[assigneeId], username: assigneeId, isUser: true})
    }
    for (const assigneeId of value.anonymousAssignees) {
      result.push({ name: assigneeId, isUser: false })
    }
    return result
  }
  
  const processedAssingees = useMemo(() => {
    const allAssignees = {
      assignees: item.assignees,
      anonymousAssignees: item.anonymousAssignees,
      invitedAssignees: item.invitedAssignees
    }
    return processAssingees(allAssignees, users)
  }, [item.assignees, item.anonymousAssignees, item.invitedAssignees, users]);

  const handleChange = useCallback((e) => {
    if (isLocked) {
      dispatch(appActions.setLockedTaskField("task"))
    }
    dispatch(
      tasksActions.handleUpdateTask({
        id: item.id,
        action: "update",
        field: "task",
        value: e.target.value,
      })
    );
  }, [item.id, isLocked]);

  const handleClickDueDate = () => {
    showModal(modals.DUE_DATE_CHOOSER, { taskId: item.id });
  }

  const handleToggleStatus = useCallback(() => {
    if (item.status === doneStatus && notDoneStatus) {
      dispatch(
        tasksActions.handleUpdateTask({
          id: item.id,
          action: "update",
          field: "status",
          value: notDoneStatus,
        })
      );
    } else if (item.status === notDoneStatus && doneStatus) {
      dispatch(
        tasksActions.handleUpdateTask({
          id: item.id,
          action: "update",
          field: "status",
          value: doneStatus,
        })
      );
    }
  }, [item.id]);

  const handleArrowUp = useCallback(() => {
    if (!prevTask) {
      dispatch(appActions.handleSetProjectTitle(true))
    } else {
      dispatch(appActions.handleSetTask(prevTask))
    }
  }, [prevTask]);

  const handleArrowDown = useCallback(() => {
    if (nextTask) {
      dispatch(appActions.handleSetTask(nextTask))
    }
  }, [nextTask]);

  const handleEnter = useCallback(() => {
    if (tasksStatus === ThingStatus.READY && !readOnly) {
      dispatch(
        tasksActions.handleCreateTask(
          initTaskState(
            item.projectId,
            generateRank(item.rank, nextTaskRank),
            selectedProject.defaultStatus,
            Object.keys(store.getState().tasks)
          )
        )
      );
    }
  }, [tasksStatus, readOnly, item.rank, nextTaskRank]);

  const handleEscape = useCallback(() => {
    dispatch(appActions.handleSetTask(null))
  }, []);

  const handleSelect = useCallback(() => {
    dispatch(appActions.handleSetTask(item.id))
  }, [item.id]);

  const handleBatchSelect = useCallback(() => {
    dispatch(appActions.handleBatchSelectTask(item.id))
  }, [item.id]);

  const handleBatchDeselect = useCallback(() => {
    dispatch(appActions.handleBatchDeselectTask(item.id))
  }, [item.id]);

  const handleDetails = useCallback(() => {
    if (window.innerWidth < 768) {
      setShouldAutoFocus(false)
      dispatch(appActions.handleSetTask(item.id))
      showModal(modals.TASK_OPTS)
      setTimeout(() => setShouldAutoFocus(true), 100);
    } else {
      if (!isSelected) {
        dispatch(appActions.handleSetTask(item.id))
      }
      if (!isRightPanelOpened) {
        dispatch(appActions.setRightPanelPage(panelPages.TASK_HUB))
        dispatch(appActions.handleSetRightPanel(true))
      }
    }
  }, [item.id, isRightPanelOpened, isSelected]);

  const handleCopy = useCallback(() => {
    window.localStorage.setItem(
      "tasksClipboard",
      "COPIEDTASKSTART=>" +
      JSON.stringify(item) +
      "<=COPIEDTASKEND"
    );
  }, [item]);

  const handleDuplicate = useCallback(() => {
    dispatch(
      tasksActions.handleCreateTask(
        copyTaskCore(
          item,
          item.projectId,
          generateRank(item.rank, nextTaskRank),
        )
      )
    );
  }, [item, nextTaskRank]);

  const handleShare = useCallback(() => {
    const linkToBeCopied = window.location.href
    navigator.clipboard.writeText(linkToBeCopied)
  }, []);

  const handleRemove = useCallback(() => {
    dispatch(tasksActions.handleRemoveTask(item, nextTask || prevTask || null))
  }, [item, prevTask]);

  return (
    <Task
      id={item.id}
      task={item.task}
      due={item.due}
      onChange={handleChange}
      onSelect={handleSelect}
      onBatchSelect={handleBatchSelect}
      onBatchDeselect={handleBatchDeselect}
      onToggleStatus={handleToggleStatus}
      onClickDueDate={handleClickDueDate}
      onCopy={handleCopy}
      onRemove={handleRemove}
      onDuplicate={handleDuplicate}
      onShare={handleShare}
      onDetails={handleDetails}
      onArrowUp={handleArrowUp}
      onArrowDown={handleArrowDown}
      onEnter={handleEnter}
      onEscape={handleEscape}
      mobile={width < 768}
      shouldAutoFocus={shouldAutoFocus}
      showDueDate={showDueDate}
      showAssignees={showAssignees}
      showDoneIndicator={showDoneIndicator}
      showCopyButton={showCopyButton}
      showDuplicateButton={showDuplicateButton}
      showShareButton={showShareButton}
      assignees={processedAssingees}
      selected={isSelected}
      batchSelected={batchSelected}
      readOnly={readOnly}
      listeners={listeners}
      isDone={item.status === doneStatus}
      isSorting={isSorting}
      isDragging={isDragging}
      isBatchSelecting={isBatchSelecting}
    />
  );
};

export default TaskItem;
