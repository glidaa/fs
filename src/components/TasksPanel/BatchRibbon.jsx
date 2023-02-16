import React from 'react'
import styles from "./BatchRibbon.module.scss"
import { useDispatch, useSelector } from "react-redux"
import * as tasksActions from "../../actions/tasks"
import * as appActions from "../../actions/app"
import { panelPages } from "../../constants";
import { ReactComponent as RemoveIcon } from "@fluentui/svg-icons/icons/delete_16_regular.svg"
import { ReactComponent as DetailsIcon } from "@fluentui/svg-icons/icons/chevron_right_16_regular.svg"
import IconButton from '../UI/IconButton'

const BatchRibbon = () => {
  const dispatch = useDispatch();
  const selectedTasks = useSelector(state => state.app.selectedTasks);
  const tasks = useSelector(state => state.tasks);
  const handleRemoveSelected = () => {
    for (const taskId of selectedTasks) {
      dispatch(tasksActions.handleRemoveTask(tasks[taskId]));
    }
  };
  const openPanel = () => {
    dispatch(appActions.setRightPanelPage(panelPages.BATCH_HUB));
    dispatch(appActions.handleSetRightPanel(true));
  }
  return selectedTasks?.length ? (
    <div className={styles.BatchRibbon}>
      <span>{selectedTasks.length} {selectedTasks.length === 1 ? "task" : "tasks"} selected</span>
      <div className={styles.BatchRibbonButtons}>
        <IconButton icon={RemoveIcon} onClick={handleRemoveSelected} />
        <IconButton icon={DetailsIcon} onClick={openPanel} />
      </div>
    </div>     
  ) : null;
}

export default BatchRibbon;
