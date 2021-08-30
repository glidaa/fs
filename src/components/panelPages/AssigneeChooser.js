import React, { useState } from 'react';
import { connect } from "react-redux";
import { API, graphqlOperation } from "aws-amplify";
import * as appActions from "../../actions/app";
import styledComponents from "styled-components";
import * as tasksActions from "../../actions/tasks"
import { AuthState } from "@aws-amplify/ui-components";
import { panelPages } from "../../constants";
import { ReactComponent as BackArrowIcon } from "../../assets/chevron-back-outline.svg";
import { ReactComponent as ShareIcon } from "../../assets/share-outline.svg"

const AssigneeChooser = (props) => {
  const {
    app: {
      selectedTask
    },
    user,
    dispatch
  } = props;

  const [keyword, setKeyword] = useState("")
  const [results, setResults] = useState([])

  const closeChooser = () => {
    return dispatch(appActions.setRightPanelPage(panelPages.DETAILS))
  }
  const handleAssignTask = async (username) => {
    await dispatch(tasksActions.handleAssignTask(selectedTask, username))
    closeChooser()
  }
  const handleChangeKeyword = (e) => {
    const nextKeyword = e.target.value
    setKeyword(nextKeyword)
    const firstLastName = nextKeyword.split(/\s+/)
    if (user.state === AuthState.SignedIn && nextKeyword.trim()) {
      const query = `
        query SearchUsers($filter: SearchableUserFilterInput!) {
          searchUsers(filter: $filter) {
            items {
              username
              firstName
              lastName
              email
              avatar
            }
          }
        }
      `
      const filter = {or: [
        { username: { matchPhrasePrefix: nextKeyword } },
        ...((firstLastName.length !== 2 && [{
          firstName: { matchPhrasePrefix: nextKeyword }
        }]) || []),
        ...((firstLastName.length === 2 && [{
          and: [
            { firstName: { matchPhrasePrefix: firstLastName[0] } },
            { lastName: { matchPhrasePrefix: firstLastName[1] } },
          ]
        }]) || []),
        { email: { matchPhrasePrefix: nextKeyword } }
      ]}
      API.graphql(graphqlOperation(query, { filter })).then(res => setResults(res.data.searchUsers.items || []))
    } else {
      setResults([])
    }
  }
  const shareTask = () => {
      const linkToBeCopied = window.location.href
      navigator.clipboard.writeText(linkToBeCopied)
  }
  return (
    <>
      <PanelPageToolbar>
        <PanelPageToolbarAction onClick={closeChooser}>
          <BackArrowIcon
              width="24"
              height="24"
              strokeWidth="32"
              color="#006EFF"
          />
        </PanelPageToolbarAction>
        <PanelPageTitle>Add Assignee</PanelPageTitle>
        <PanelPageToolbarAction onClick={shareTask}>
          <ShareIcon
              width="24"
              height="24"
              strokeWidth="32"
              color="#006EFF"
          />
        </PanelPageToolbarAction>
      </PanelPageToolbar>
      <KeywordField
        type="text"
        name="keyword"
        placeholder="Start searching…"
        onChange={handleChangeKeyword}
        value={keyword}
      />
      <SearchResults>
        {keyword && <AnonymousUserItem
          key="::anonymous::"
          onClick={() => handleAssignTask(`anonymous:${keyword}`)}
        >
          <LetterAvatar>{keyword[0].toUpperCase()}</LetterAvatar>
          <div>
            <span>{keyword}</span>
            <span>Anonymous Assignee</span>
          </div>
        </AnonymousUserItem>}
        {results.map(x => (
          <SearchResultsItem
            key={x.username}
            onClick={() => handleAssignTask(`user:${x.username}`)}
          >
           {x.avatar ?
              <ImageAvatar src={x.avatar} /> :
              <LetterAvatar>{(x.firstName[0] + x.lastName[0]).toUpperCase()}</LetterAvatar>
            }
            <div>
              <span>{`${x.firstName} ${x.lastName}`}</span>
              <span>{x.email}</span>
            </div>
          </SearchResultsItem>
        ))}
      </SearchResults>
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

const KeywordField = styledComponents.input`
  width: calc(100% - 90px);
  outline: none;
  border: none;
  background-color: #F8F8F8;
  padding: 10px;
  border-radius: 8px;
  margin: 0 25px;
  font-size: 14px;
  font-weight: 400;
  &::placeholder {
    color: #C0C0C0;
  }
`

const SearchResults = styledComponents.div`
  display: flex;
  flex-direction: column;
  background-color: #FFFFFF;
  border-radius: 4px;
  width: 100%;
`

const AnonymousUserItem = styledComponents.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  padding: 10px 25px;
  & > div:nth-child(2) {
    display: flex;
    flex-direction: column;
    & > span:nth-child(1) {
      font-weight: bold;
      color: #222222;
    }
    & > span:nth-child(2) {
      font-style: italic;
      color: grey;
    }
  }
  &:hover {
    background-color: #E4E4E2;
  }
`

const SearchResultsItem = styledComponents.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  padding: 10px 25px;
  & > div:nth-child(2) {
    display: flex;
    flex-direction: column;
    & > span:nth-child(1) {
      font-weight: bold;
      color: #222222;
    }
    & > span:nth-child(2) {
      font-style: italic;
      color: grey;
    }
  }
  &:hover {
    background-color: #E4E4E2;
  }
`

const ImageAvatar = styledComponents.img`
  display: inline;
  border-radius: 100%;
  width: 32px;
  height: 32px;
`

const LetterAvatar = styledComponents.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  background-color: #FF93AF;
  color: #6B001D;
  line-height: 0;
  font-size: 13.33px;
  min-width: 32px;
  min-height: 32px;
  width: 32px;
  height: 32px;
`

export default connect((state) => ({
  user: state.user,
  tasks: state.tasks,
  app: state.app,
  users: state.users,
}))(AssigneeChooser);
