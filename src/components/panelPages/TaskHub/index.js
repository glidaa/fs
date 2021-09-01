import React, { useRef, useEffect, useState } from 'react';
import { connect } from "react-redux";
import * as appActions from "../../../actions/app";
import { AuthState } from "@aws-amplify/ui-components";
import styledComponents from "styled-components";
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
      <PanelPageToolbar>
        <PanelPageToolbarAction onClick={closePanel}>
          <BackArrowIcon
              width={24}
              height={24}
              strokeWidth={32}
              color="#006EFF"
          />
        </PanelPageToolbarAction>
        <PanelPageTitle>Task Hub</PanelPageTitle>
        <PanelPageToolbarAction onClick={shareTask}>
          <ShareIcon
              width={24}
              height={24}
              strokeWidth={32}
              color="#006EFF"
          />
        </PanelPageToolbarAction>
      </PanelPageToolbar>
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

const PanelPageToolbar = styledComponents.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 25px;
  padding-top: 25px;
`

const PanelPageTitle = styledComponents.span`
  color: #000000;
  font-size: 18px;
  font-weight: 600;
`

const PanelPageToolbarAction = styledComponents.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  background-color: transparent;
  cursor: pointer;
`

export default connect((state) => ({
  user: state.user,
  tasks: state.tasks,
  app: state.app,
  comments: state.comments,
  users: state.users,
}))(TaskHub);
