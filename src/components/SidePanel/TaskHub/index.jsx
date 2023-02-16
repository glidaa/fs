import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from "react-redux";
import * as appActions from "../../../actions/app";
import { AuthState } from "../../../constants";
import Comments from "./Comments";
import { ReactComponent as ShareIcon } from "@fluentui/svg-icons/icons/share_24_regular.svg"
import PanelTabs from '../../UI/PanelTabs';
import Details from './Details';
import { useModal } from '../../ModalManager';
import modals from '../../modals';

const TaskHub = forwardRef((_, ref) => {

  const idleTrigger = useRef(null)
  const dispatch = useDispatch();

  const userState = useSelector(state => state.user.state);

  const lockedTaskField = useSelector(state => state.app.lockedTaskField);
  const selectedProject = useSelector(state => state.app.selectedProject);

  const projects = useSelector(state => state.projects);

  const { showModal } = useModal();

  const forceIdle = () => {
    if (["task", "description"].includes(lockedTaskField)) {
      dispatch(appActions.setLockedTaskField(null))
    }
    clearTimeout(idleTrigger.current)
  }

  useEffect(() => () => forceIdle(), [])

  const [tab, setTab] = useState("details")

  const closePanel = () => {
    forceIdle()
    return dispatch(appActions.handleSetRightPanel(false))
  }
  const shareTask = () => {
    const linkToBeCopied = window.location.href
    navigator.clipboard.writeText(linkToBeCopied)
  }
  const openAttachmentsUploader = (importedBlobs) => {
    showModal(modals.UPLOAD, { importedBlobs })
  }
  useImperativeHandle(ref, () => ({
    panelProps: {
      title: "Task Hub",
      actionIcon: ShareIcon,
      header: (userState === AuthState.SignedIn ||
        (userState !== AuthState.SignedIn &&
          projects[selectedProject]?.isTemp)) && (
        <center>
          <PanelTabs
            tabs={[
              ["details", "Details"],
              ["comments", "Comments"],
            ]}
            value={tab}
            onChange={(newVal) => setTab(newVal)}
          />
        </center>
      ),
      onClose: () => {
        closePanel()
      },
      onAction: () => {
        shareTask();
      },
      onFilesDrop: tab === "details"
        ? openAttachmentsUploader
        : null,
    }
  }));
  return tab === "details" ? (
    <Details />
  ) : tab === "comments" ? (
    <Comments />
  ) : null;
});

TaskHub.displayName = "TaskHub";

export default TaskHub;
