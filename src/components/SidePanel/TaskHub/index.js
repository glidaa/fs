import React, { useRef, useEffect, useState } from 'react';
import { connect } from "react-redux";
import * as appActions from "../../../actions/app";
import { AuthState } from "../../../constants";
import styles from "./index.module.scss"
import Comments from "./Comments";
import { ReactComponent as BackArrowIcon } from "../../../assets/chevron-back-outline.svg";
import { ReactComponent as ShareIcon } from "../../../assets/share-outline.svg"
import PanelTabs from '../../PanelTabs';
import Details from './Details';

const TaskHub = (props) => {
  const {
    user,
    app: {
      lockedTaskField
    },
    dispatch
  } = props;
  
  const idleTrigger = useRef(null)
	
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
  return (
    <>
      <div className={styles.PanelPageToolbar}>
        <button
          className={styles.PanelPageToolbarAction}
          onClick={closePanel}
        >
          <BackArrowIcon
            width={24}
            height={24}
          />
        </button>
        <span className={styles.PanelPageTitle}>
          Task Hub
        </span>
        <button
          className={styles.PanelPageToolbarAction}
          onClick={shareTask}
        >
          <ShareIcon
            width={24}
            height={24}
          />
        </button>
      </div>
      {user.state === AuthState.SignedIn && (
        <PanelTabs
          tabs={[
            ["details", "Details"],
            ["comments", "Comments"]
          ]}
          value={tab}
          onChange={(newVal) => setTab(newVal)}
        />
      )}
      {tab === "details" && <Details />}
      {tab === "comments" && <Comments />}
    </>
  );
};

export default connect((state) => ({
  user: state.user,
  tasks: state.tasks,
  app: state.app,
  comments: state.comments,
  users: state.users
}))(TaskHub);
