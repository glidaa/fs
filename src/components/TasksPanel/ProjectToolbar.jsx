import React from 'react'
import styles from "./ProjectToolbar.module.scss"
import { useDispatch, useSelector } from "react-redux"
import * as tasksActions from "../../actions/tasks"
import * as appActions from "../../actions/app"
import sortByRank from "../../utils/sortByRank"
import copyTask from "../../utils/copyTask"
import { panelPages } from "../../constants";
import { ReactComponent as ClipboardIcon } from "@fluentui/svg-icons/icons/clipboard_paste_16_regular.svg"
import { ReactComponent as ShareIcon } from "@fluentui/svg-icons/icons/share_16_regular.svg"
import { ReactComponent as SettingsIcon } from "@fluentui/svg-icons/icons/settings_16_regular.svg"
import { ReactComponent as ExportIcon } from "@fluentui/svg-icons/icons/cloud_arrow_down_16_regular.svg"
import { ReactComponent as ImportIcon } from "@fluentui/svg-icons/icons/cloud_arrow_up_16_regular.svg"
import ShadowScroll from '../ShadowScroll';
import { useModal } from '../ModalManager';
import modals from '../modals';
import generateRank from '../../utils/generateRank'
import Button from '../UI/Button'
import { useReadOnly } from '../ReadOnlyListener'

const ProjectToolbar = () => {
  const { showModal } = useModal();
  const dispatch = useDispatch();
  const readOnly = useReadOnly();

  const selectedProject = useSelector(state => state.app.selectedProject);

  const tasks = useSelector(state => state.tasks);

  const openProjectSettings = () => {
    dispatch(appActions.setLeftPanelPage(panelPages.PROJECT_SETTINGS))
    dispatch(appActions.handleSetLeftPanel(true))
  }
  const openExportModal = () => {
    showModal(modals.EXPORT)
  }
  const openImportModal = () => {
    showModal(modals.IMPORT)
  }
  const pasteTask = () => {
    const tasksClipboardData = window.localStorage.getItem("tasksClipboard")
    if (tasksClipboardData) {
      const stringifiedTaskState = /COPIEDTASKSTART=>({.+})<=COPIEDTASKEND/.exec(tasksClipboardData)[1]
      if (stringifiedTaskState) {
        const taskState = JSON.parse(stringifiedTaskState)
        if (taskState) {
          dispatch(tasksActions.handleCreateTask(
              copyTask(
                taskState,
                selectedProject,
                generateRank(sortByRank(tasks, true)[0]?.rank),
                Object.keys(tasks)
              )
            )
          )
        }
      }
    }
  }
  return (
    <div className={styles.ToolbarContainer}>
      <ShadowScroll style={{ maxWidth: "fit-content" }}>
        {!readOnly && (
          <>
            <Button
              icon={ClipboardIcon}
              label="Paste"
              onClick={pasteTask}
            />
            <Button
              icon={ImportIcon}
              label="Import"
              onClick={openImportModal}
            />
          </>
        )}
        <Button
          icon={ExportIcon}
          label="Export"
          onClick={openExportModal}
        />
        <Button
          icon={ShareIcon}
          label="Share"
          onClick={() => {
            const linkToBeCopied = window.location.href.replace(/\/\d+/, "")
            navigator.clipboard.writeText(linkToBeCopied)
          }}
        />
        <Button
          icon={SettingsIcon}
          label="Settings"
          onClick={openProjectSettings}
        />
      </ShadowScroll>
    </div>     
  )
}

export default ProjectToolbar;
