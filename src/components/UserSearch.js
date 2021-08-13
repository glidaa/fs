import React, { useState } from 'react';
import { connect } from "react-redux";
import * as appActions from "../actions/app";
import styledComponents from "styled-components";
import "draft-js/dist/Draft.css";
import { ReactComponent as BackArrowIcon } from "../assets/chevron-back-outline.svg";
import { ReactComponent as ShareIcon } from "../assets/share-outline.svg"

const UserSearch = (props) => {
  const {
    app: {
      isDetailsPanelOpened
    },
    dispatch
  } = props;

  const [keyword, setKeyword] = useState("")
  
  const closePanel = () => {
    return dispatch(appActions.handleSetDetailsPanel(false))
  }
  const handleChangeKeyword = (e) => {
      const nextKeyword = e.target.value
      setKeyword(nextKeyword)
  }
    const shareTask = () => {
        const linkToBeCopied = window.location.href
        navigator.clipboard.writeText(linkToBeCopied)
    }
  return (
    <DetailsPanelShell open={isDetailsPanelOpened}>
      <DetailsPanelToolbar>
        <DetailsPanelToolbarAction onClick={closePanel}>
          <BackArrowIcon
              width="24"
              height="24"
              strokeWidth="32"
              color="#006EFF"
          />
        </DetailsPanelToolbarAction>
        <DetailsPanelTitle>Add Assignees</DetailsPanelTitle>
        <DetailsPanelToolbarAction onClick={shareTask}>
          <ShareIcon
              width="24"
              height="24"
              strokeWidth="32"
              color="#006EFF"
          />
        </DetailsPanelToolbarAction>
      </DetailsPanelToolbar>
      <KeywordField
        type="text"
        name="keyword"
        placeholder="Start searching…"
        onChange={handleChangeKeyword}
        value={keyword}
      />
    </DetailsPanelShell>
  );
};

const DetailsPanelShell = styledComponents.div`
  display: flex;
  background-color: #FFFFFF;
  flex-direction: column;
  height: 100vh;
  border-radius: 35px 0 0 35px;
  gap: 25px;
  flex: 1;
  transition: all 0.2s ease;
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(100%)")};
  max-width: ${({ open }) => (open ? "100vw" : "0px")};
  overflow: ${({ open }) => (open ? "auto" : "hidden")};
  @media only screen and (max-width: 768px) {
    position: fixed;
    width: 100vw;
    max-width: 100vw;
  }
  z-index: 1;
`;

const DetailsPanelToolbar = styledComponents.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 35px;
  padding-top: 25px;
`

const DetailsPanelTitle = styledComponents.span`
  color: #000000;
  font-size: 1.5em;
  font-weight: 600;
`

const DetailsPanelToolbarAction = styledComponents.button`
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

const KeywordField = styledComponents.input`
  width: calc(100% - 90px);
  outline: none;
  border: none;
  background-color: #F8F8F8;
  padding: 10px;
  border-radius: 8px;
  margin: 0 35px;
  font-size: 0.9em;
  font-weight: 500;
  &::placeholder {
    color: #C0C0C0;
  }
`

export default connect((state) => ({
  user: state.user,
  tasks: state.tasks,
  app: state.app,
  comments: state.comments,
  users: state.users,
}))(UserSearch);
