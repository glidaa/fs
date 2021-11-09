import React, { useEffect } from 'react';
import { connect } from "react-redux";
import { useDrag } from '@use-gesture/react'
import { animated, useSpring, config } from '@react-spring/web'
import * as appActions from "../actions/app"
import * as tasksActions from "../actions/tasks"
import copyTaskCore from "../utils/copyTask"
import { ReactComponent as RemoveIcon } from "../assets/trash-outline.svg"
import { ReactComponent as CopyIcon } from "../assets/copy-outline.svg"
import { ReactComponent as DuplicateIcon } from "../assets/duplicate-outline.svg"
import { ReactComponent as ShareIcon } from "../assets/share-outline.svg"
import { ReactComponent as DetailsIcon } from "../assets/information-circle-outline.svg";
import { ReactComponent as CheckmarkIcon } from "../assets/checkmark-circle-outline.svg";
import styles from "./ActionSheet.module.scss"

const ActionSheet = (props) => {
  
  const {
    app: {
      selectedTask,
      selectedProject,
      isActionSheetOpened,
      isRightPanelOpened
    },
    tasks,
    dispatch
  } = props

  const [{ y }, api] = useSpring(() => ({ y: 243 }))

  const openActionSheet = ({ canceled }) => {
    api.start({ y: 0, immediate: false, config: canceled ? config.wobbly : config.stiff })
  }
  
  const closeActionSheet = () => {
  dispatch(appActions.setActionSheet(false))
    api.start({ y: 243, immediate: false, config: { ...config.stiff } })
  }

  const bind = useDrag(
    ({ last, velocity: [, vy], movement: [, my], cancel, canceled }) => {
      if (my < 0) {
        cancel()
      }
      if (last) {
        my > 243 * 0.5 || vy > 0.5 ?
        closeActionSheet() :
        openActionSheet({ canceled })
      } else {
        api.start({ y: my, immediate: true })
      }
    },
    {
      from: () => [0, y.get()],
      filterTaps: true,
      bounds: { top: 0 },
      rubberband: true
    }
  )

  const display = y.to((py) => (py < 243 ? null : "none"))

  useEffect(() => {
    if (isActionSheetOpened) {
      openActionSheet({ canceled: null })
    } else {
      closeActionSheet()
    }
  }, [isActionSheetOpened])

  const copyTask = () => {
    closeActionSheet()
    window.localStorage.setItem(
      "tasksClipboard",
      "COPIEDTASKSTART=>" +
      JSON.stringify(tasks[selectedTask]) +
      "<=COPIEDTASKEND"
    );
  }

  const duplicateTask = () => {
    closeActionSheet()
    dispatch(
      tasksActions.handleCreateTask(
        copyTaskCore(
          tasks[selectedTask],
          selectedProject,
          selectedTask,
          tasks[selectedTask].nextTask
        )
      )
    );
  }

  const shareTask = () => {
    closeActionSheet()
    const linkToBeCopied = window.location.href
    navigator.clipboard.writeText(linkToBeCopied)
  }

  const removeTask = () => {
    closeActionSheet()
    dispatch(
      tasksActions.handleRemoveTask(
        tasks[selectedTask]
      )
    )
  }

  const openRightPanel = () => {
    closeActionSheet()
    if (!isRightPanelOpened) {
      return dispatch(appActions.handleSetRightPanel(true))
    }
  }

  return (
    <animated.div
      className={styles.ActionSheetShell}
      style={{ display }}
      onClick={closeActionSheet}
    >
      <animated.div
        className={styles.ActionSheetContainer}
        style={{ display, y }}
        {...bind()}
      >
      <span className={styles.ActionSheetHeader}>
        Task Actions
      </span>
      <div className={styles.Actions}>
        <button
          className={styles.Action}
          onClick={copyTask}
        >
          <CopyIcon
            width={24}
            height={24}
            strokeWidth={32}
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
          />
          <span>Remove</span>
        </button>
        <button
          className={styles.Action}
          onClick={removeTask}
        >
          <CheckmarkIcon
            width={24}
            height={24}
          />
          <span>Mark As Done</span>
        </button>
        <button
          className={styles.Action}
          onClick={openRightPanel}
        >
          <DetailsIcon
            width={24}
            height={24}
          />
          <span>Details</span>
        </button>
      </div>
      <button
        className={styles.CloseBtn}
        onClick={closeActionSheet}
      >
        Cancel
      </button>
      </animated.div>
    </animated.div>
  )
}

export default connect((state) => ({
  user: state.user,
  tasks: state.tasks,
  app: state.app,
  users: state.users
}))(ActionSheet);