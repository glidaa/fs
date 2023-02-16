import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import * as appActions from "../../actions/app"
import * as tasksActions from "../../actions/tasks"
import copyTaskCore from "../../utils/copyTask"
import { ReactComponent as RemoveIcon } from "@fluentui/svg-icons/icons/delete_24_regular.svg"
import { ReactComponent as CopyIcon } from "@fluentui/svg-icons/icons/copy_24_regular.svg"
import { ReactComponent as DuplicateIcon } from "@fluentui/svg-icons/icons/document_copy_24_regular.svg"
import { ReactComponent as ShareIcon } from "@fluentui/svg-icons/icons/share_24_regular.svg"
import { ReactComponent as DetailsIcon } from "@fluentui/svg-icons/icons/info_24_regular.svg"
import { ReactComponent as CheckmarkIcon } from "@fluentui/svg-icons/icons/checkmark_circle_24_regular.svg"
import styles from "./TaskOpts.module.scss"
import Modal from '../UI/Modal/';
import { useModal } from '../ModalManager';
import { panelPages } from '../../constants';
import getNextItem from '../../utils/getNextItem';
import generateRank from '../../utils/generateRank';

const TaskOpts = () => {

  const { modalRef, hideModal } = useModal();
  const dispatch = useDispatch();

  const selectedProjectId = useSelector(state => state.app.selectedProject)

  const tasks = useSelector(state => state.tasks)
  const selectedTask = useSelector(state => state.tasks[state.app.selectedTask])

  const copyTask = () => {
    hideModal()
    window.localStorage.setItem(
      "tasksClipboard",
      "COPIEDTASKSTART=>" +
      JSON.stringify(selectedTask) +
      "<=COPIEDTASKEND"
    );
  }

  const duplicateTask = () => {
    hideModal()
    dispatch(
      tasksActions.handleCreateTask(
        copyTaskCore(
          selectedTask,
          selectedProjectId,
          generateRank(
            selectedTask.rank,
            getNextItem(selectedTask.rank, tasks)?.rank
          )
        )
      )
    );
  }

  const shareTask = () => {
    hideModal()
    const linkToBeCopied = window.location.href
    navigator.clipboard.writeText(linkToBeCopied)
  }

  const removeTask = () => {
    hideModal()
    dispatch(
      tasksActions.handleRemoveTask(
        selectedTask
      )
    )
  }

  const markTaskAsDone = () => {
    hideModal()
    dispatch(
      tasksActions.handleUpdateTask({
        id: selectedTask?.id,
        action: "update",
        field: "status",
        value: "done",
      })
    );
  }

  const openRightPanel = () => {
    hideModal()
    dispatch(appActions.setRightPanelPage(panelPages.TASK_HUB))
    dispatch(appActions.handleSetRightPanel(true))
  }

  return (
    <Modal
      title="Task Actions"
      primaryButtonText="Cancel"
      onPrimaryButtonClick={hideModal}
      modalRef={modalRef}
    >
      <div className={styles.Actions}>
        <button
          className={styles.Action}
          onClick={copyTask}
        >
          <CopyIcon
            width={24}
            height={24}
            strokeWidth={32}
            fill="currentColor"
          />
          <span>Copy</span>
        </button>
        <button
          className={styles.Action}
          onClick={duplicateTask}
        >
          <DuplicateIcon
            width={24}
            height={24}
            fill="currentColor"
          />
          <span>Duplicate</span>
        </button>
        <button
          className={styles.Action}
          onClick={shareTask}
        >
          <ShareIcon
            width={24}
            height={24}
            fill="currentColor"
          />
          <span>Share</span>
        </button>
        <button
          className={styles.Action}
          onClick={removeTask}
        >
          <RemoveIcon
            width={24}
            height={24}
            fill="currentColor"
          />
          <span>Remove</span>
        </button>
        <button
          className={styles.Action}
          onClick={markTaskAsDone}
        >
          <CheckmarkIcon
            width={24}
            height={24}
            fill="currentColor"
          />
          <span>Done</span>
        </button>
        <button
          className={styles.Action}
          onClick={openRightPanel}
        >
          <DetailsIcon
            width={24}
            height={24}
            fill="currentColor"
          />
          <span>Details</span>
        </button>
      </div>
    </Modal>
  )
}

export default TaskOpts;