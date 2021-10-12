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
import { ReactComponent as DetailsIcon } from "../assets/info_black_24dp.svg";
import { ReactComponent as CheckmarkIcon } from "../assets/checkmark-circle-outline.svg";
import styled from "styled-components";

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
    <ActionSheetShell style={{ display }} onClick={closeActionSheet}>
        <ActionSheetContainer {...bind()} style={{ display, y }}>
        <ActionSheetHeader>Task Actions</ActionSheetHeader>
        <Actions>
          <Action onClick={copyTask}>
            <CopyIcon
              width={24}
              height={24}
              color="#000000"
              strokeWidth="32"
            />
            <span>Copy</span>
          </Action>
          <Action onClick={duplicateTask}>
            <DuplicateIcon
              width={24}
              height={24}
              color="#000000"
              strokeWidth="32"
            />
            <span>Duplicate</span>
          </Action>
          <Action onClick={shareTask}>
            <ShareIcon
              width={24}
              height={24}
              color="#000000"
              strokeWidth="32"
            />
            <span>Share</span>
          </Action>
          <Action onClick={removeTask}>
            <RemoveIcon
              width={24}
              height={24}
              color="#000000"
              strokeWidth="32"
            />
            <span>Remove</span>
          </Action>
          <Action onClick={removeTask}>
            <CheckmarkIcon
              width={24}
              height={24}
              stroke="#000000"
              strokeWidth="32"
            />
            <span>Mark As Done</span>
          </Action>
          <Action onClick={openRightPanel}>
            <DetailsIcon
              width="24"
              height="24"
              color="#000000"
              strokeWidth="32"
            />
            <span>Details</span>
          </Action>
        </Actions>
        <CloseBtn onClick={closeActionSheet}>
          Cancel
        </CloseBtn>
        </ActionSheetContainer>
    </ActionSheetShell>
  )
}

const ActionSheetShell = styled(animated.div)`
  display: block;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: #000000AA;
  z-index: 99999;
`

const ActionSheetContainer = styled(animated.div)`
  position: fixed;
  display: flex;
  touch-action: none;
  flex-direction: column;
  gap: 10px;
  bottom: 0;
  width: calc(100% - 40px);
  background-color: #FFFFFF;
  padding: 20px;
  border-radius: 20px 20px 0 0;
`

const ActionSheetHeader = styled.span`
  width: 100%;
  text-align: center;
  font-weight: bold;
  color: #000000;
`

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 10px;
  grid-row-gap: 10px;
`

const Action = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-radius: 10px;
  gap: 5px;
  font-size: 14px;
  color: #000000;
  font-weight: bold;
  padding: 15px;
  background-color: #F0F0F0;
  cursor: pointer;
  outline: none;
  border: none;
`

const CloseBtn = styled.button`
  outline: none;
  border: none;
  color: #FFFFFF;
  background-color: var(--primary);
  width: 100%;
  font-weight: bold;
  padding: 10px 0;
  border-radius: 10px;
  cursor: pointer;
`

export default connect((state) => ({
  user: state.user,
  tasks: state.tasks,
  app: state.app,
  users: state.users,
}))(ActionSheet);