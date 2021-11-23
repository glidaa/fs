import React, { useRef, useMemo } from "react"
import { connect } from "react-redux";
import styles from "./TaskItem.module.scss"
import useWindowSize from "../../utils/useWindowSize";
import formatDate from "../../utils/formatDate"
import copyTaskCore from "../../utils/copyTask"
import * as appActions from "../../actions/app";
import * as tasksActions from "../../actions/tasks";
import { ReactComponent as CheckmarkIcon } from "../../assets/checkmark-outline.svg";
import { ReactComponent as OptionsIcon } from "../../assets/ellipsis-vertical.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash-outline.svg"
import { ReactComponent as CopyIcon } from "../../assets/copy-outline.svg"
import { ReactComponent as DuplicateIcon } from "../../assets/duplicate-outline.svg"
import { ReactComponent as ShareIcon } from "../../assets/share-outline.svg"
import { ReactComponent as DetailsIcon } from "../../assets/information-circle-outline.svg";
import SlashCommands from "../SlashCommands";
import { OK, initTaskState, AuthState } from "../../constants";
import AvatarGroup from "../UI/AvatarGroup";

const TaskItem = (props) => {

  const {
    item,
    tasks,
    users,
    user,
    projects,
    collaboration,
    app: {
      selectedTask,
      selectedProject,
      taskAddingStatus,
      isRightPanelOpened,
      isActionSheetOpened,
      isSynced,
      lockedTaskField,
      command
    },
    nextTask,
    prevTask,
    listeners,
    isSorting,
    isDragging,
    dispatch
  } = props;

  const { width } = useWindowSize();

  const inputRef = useRef(null)

  const processAssingees = (value, users) => {
    const result = []
    for (const assignee of value) {
      const isValidAssignee = /^(user|anonymous):(.*)$/.test(assignee)
      if (isValidAssignee) {
        const [, assigneeType, assigneeID] = assignee.match(/(user|anonymous):(.*)/)
        const isUser = assigneeType === "user"
        if (isUser) {
          result.push({...users[assigneeID], isUser})
        } else {
          result.push({ name: assigneeID, isUser })
        }
      }
    }
    return result
  }

  const getReadOnly = (user, projects, selectedProject, isSynced) => {
    return user.state === AuthState.SignedIn &&
    ((projects[selectedProject]?.owner !== user.data.username &&
    projects[selectedProject]?.permissions === "r") || !isSynced)
  }

  const readOnly = useMemo(() => getReadOnly(user, projects, selectedProject, isSynced), [user, projects, selectedProject, isSynced])
  
  const processedAssingees = useMemo(() => processAssingees(item.assignees, users), [item.assignees, users]);

  const getSlashCommandsPos = (inputRef) => {
    if (inputRef.current) {
      const inputPos = inputRef.current.getBoundingClientRect()
      const cursorPos = 
        inputRef.current.selectionStart * 9.6 < inputPos.left - 40 ?
        inputPos.left - 40 :
        inputRef.current.selectionStart * 9.6
      return {
        top: inputPos.top + 40,
        left: inputPos.left - 160 + cursorPos
      }
    } else {
      return {
        top: 0,
        left: 0
      }
    }
  }

  const slashCommandsPos = useMemo(() => getSlashCommandsPos(inputRef), [tasks])

  const onChange = (e) => {
    if (lockedTaskField !== "task") {
      dispatch(appActions.setLockedTaskField("task"))
    }
    dispatch(
      tasksActions.handleUpdateTask({
        id: selectedTask,
        task: e.target.value,
      })
    );
  };

  const toggleStatus = (item) => {
    dispatch(
      tasksActions.handleUpdateTask({
        id: item.id,
        status: item.status === "done" ? "todo" : "done",
      })
    );
  };

  const handleKeyUp = (e) => {
    if (!command) {
      if (e.key === "Enter") {
        if (taskAddingStatus === OK && !readOnly) {
          dispatch(
            tasksActions.handleCreateTask(
              initTaskState(
                selectedProject,
                selectedTask,
                nextTask
              )
            )
          );
        }
      } else if (e.key === "ArrowUp") {
        if (!prevTask) {
          return dispatch(appActions.handleSetProjectTitle(true))
        } else {
          return dispatch(appActions.handleSetTask(prevTask))
        }
      } else if (e.key === "ArrowDown") {
        if (nextTask) {
          return dispatch(appActions.handleSetTask(nextTask))
        }
      } else if (e.key === "Escape") {
        return dispatch(appActions.handleSetTask(null))
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Enter") {
      e.preventDefault()
    }
  }

  const onChooseSuggestion = (suggestion) =>
    dispatch(
      tasksActions.handleUpdateTask({
        id: selectedTask,
        task: tasks[selectedTask] + suggestion,
      })
    );

  const openActionSheet = (item) => {
    dispatch(
      appActions.handleSetTask(item.id)
    )
    dispatch(
      appActions.setActionSheet(true)
    )
  }

  const selectItem = (item) => {
    return dispatch(appActions.handleSetTask(item.id))
  }

  const openRightPanel = (item) => {
    if (item.id !== selectedTask) {
      dispatch(appActions.handleSetTask(item.id))
    }
    if (!isRightPanelOpened) {
      return dispatch(appActions.handleSetRightPanel(true))
    }
  }

  const copyTask = (item) => {
    window.localStorage.setItem(
      "tasksClipboard",
      "COPIEDTASKSTART=>" +
      JSON.stringify(item) +
      "<=COPIEDTASKEND"
    );
  }

  const duplicateTask = (item) => {
    dispatch(
      tasksActions.handleCreateTask(
        copyTaskCore(
          item,
          selectedProject,
          item.id,
          item.nextTask
        )
      )
    );
  }

  const shareTask = () => {
    const linkToBeCopied = window.location.href
    navigator.clipboard.writeText(linkToBeCopied)
  }

  const removeTask = (item) => {
    dispatch(tasksActions.handleRemoveTask(item))
  }

  return (
    <div
      {...listeners}
      className={[
        styles.TaskItemShell,
        ...(isSorting && [styles.sorting] || []),
        ...(isDragging && [styles.dragging] || [])
      ].join(" ")}
    >
      <div
        className={[
          styles.TaskItemCore,
          ...(isSorting && [styles.sorting] || []),
          ...(isDragging && [styles.dragging] || []),
          ...(collaboration.taskViewers[item.id] && [styles.collaborativeFocused] || []),
          ...(item.id === selectedTask && [styles.focused] || [])
        ].join(" ")}
        style={{
          borderColor: collaboration.taskViewers[item.id] && users[collaboration.taskViewers[item.id][0]].color,
        }}
      >
        <div className={styles.TaskItemLeftPart}>
          <div className={styles.TaskItemLeftLeftPart}>
            <button
              className={[
                styles.TaskItemStatusToggle,
                ...(item.status === "done" && [styles.done] || [])
              ].join(" ")}
              onClick={() => toggleStatus(item)}
            >
              {item.status === "done" && (
                <CheckmarkIcon
                  width={24}
                  height={24}
                />
              )}
            </button>
            {selectedTask === item.id ? (
              <div className={styles.TaskItemInput}>
                <input
                  type="text"
                  ref={inputRef}
                  className="task"
                  placeholder="Task…"
                  value={(tasks[selectedTask].task || "") + (command || "")}
                  onKeyUp={handleKeyUp}
                  onKeyDown={handleKeyDown}
                  onChange={onChange}
                  autoFocus={!(isRightPanelOpened || isActionSheetOpened)}
                  contentEditable={false}
                  readOnly={readOnly}
                />
              </div>
            ) : (
              <span
                onClick={() => selectItem(item)}
                className={[
                  styles.TaskItemHeader,
                  ...(!item.task && [styles.placeholder] || []),
                  ...(item.status === "done" && [styles.done] || [])
                ].join(" ")}
              >
                {item.task || "Task…"}
              </span>
            )}
          </div>
          <div className={styles.TaskItemLeftRightPart}>
            {width > 768 ?
            <div className={styles.TaskItemActions}>
              <button className={styles.TaskItemAction} onClick={() => copyTask(item)}>
                <CopyIcon height={18} />
              </button>
              {!readOnly && (
                <button className={styles.TaskItemAction} onClick={() => duplicateTask(item)}>
                  <DuplicateIcon height={18} />
                </button>
              )}
              <button className={styles.TaskItemAction} onClick={() => shareTask(item)}>
                <ShareIcon height={18} />
              </button>
              {!readOnly && (
                <button className={styles.TaskItemAction} onClick={() => removeTask(item)}>
                  <RemoveIcon height={18} />
                </button>
              )}
              <button className={styles.TaskItemAction} onClick={() => openRightPanel(item)}>
                <DetailsIcon height={18} />
              </button>
            </div> :
            <button className={styles.TaskItemOptsBtn} onClick={() => openActionSheet(item)}>
              <OptionsIcon width={18} />
            </button>}
          </div>
        </div>
        <div
          className={[
            styles.TaskItemRightPart,
            ...(item.id === selectedTask && [styles.focused] || []),
          ].join(" ")}
        >
          <span className={styles.TaskItemDueDate}>
            {item.due ? formatDate(item.due) : "No Due"}
          </span>
          <AvatarGroup
            max={4}
            users={processedAssingees}
            size={ width > 768 ? 24 : 18 }
          />
        </div>
      </div>
      {(command && selectedTask === item.id) && (
        <SlashCommands
          onChooseSuggestion={onChooseSuggestion}
          posInfo={slashCommandsPos}
        />
      )}
    </div>
  );
};

export default connect((state) => ({
  user: state.user,
  tasks: state.tasks,
  app: state.app,
  users: state.users,
  projects: state.projects,
  collaboration: state.collaboration
}))(TaskItem);
