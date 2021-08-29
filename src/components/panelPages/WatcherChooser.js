import React, { useState } from 'react';
import { connect } from "react-redux";
import { API, graphqlOperation } from "aws-amplify";
import * as appActions from "../../actions/app";
import styledComponents from "styled-components";
import "draft-js/dist/Draft.css";
import * as tasksActions from "../../actions/tasks"
import { assignTask, unassignTask } from "../../graphql/mutations";
import { NOT_ASSIGNED } from "../../constants";
import { ReactComponent as BackArrowIcon } from "../../assets/chevron-back-outline.svg";
import { ReactComponent as ShareIcon } from "../../assets/share-outline.svg"

const WatcherChooser = (props) => {
  const {
    onChooseUser,
    app: {
      isRightPanelOpened
    },
    dispatch
  } = props;

  const [keyword, setKeyword] = useState("")
  const [results, setResults] = useState([])
  
  const closePanel = () => {
    return dispatch(appActions.handleSetRightPanel(false))
  }
  const handleChangeKeyword = (e) => {
    const nextKeyword = e.target.value
    setKeyword(nextKeyword)
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
      { firstName: { matchPhrasePrefix: nextKeyword } },
      { email: { matchPhrasePrefix: nextKeyword } }
    ]}
    API.graphql(graphqlOperation(query, { filter })).then(res => setResults(res.data.searchUsers.items || []))
  }
  const shareTask = () => {
      const linkToBeCopied = window.location.href
      navigator.clipboard.writeText(linkToBeCopied)
  }
  const handleChooseRegisteredUser = (username) => {
    onChooseUser(`user:${username}`)
  }
  const handleChooseAnonymousUser = () => {
    onChooseUser(`anonymous:${keyword}`)
  }
  return (
    <>
      <RightPanelToolbar>
        <RightPanelToolbarAction onClick={closePanel}>
          <BackArrowIcon
              width="24"
              height="24"
              strokeWidth="32"
              color="#006EFF"
          />
        </RightPanelToolbarAction>
        <RightPanelTitle>Add Assignee</RightPanelTitle>
        <RightPanelToolbarAction onClick={shareTask}>
          <ShareIcon
              width="24"
              height="24"
              strokeWidth="32"
              color="#006EFF"
          />
        </RightPanelToolbarAction>
      </RightPanelToolbar>
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
          onClick={handleChooseAnonymousUser}
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
            onClick={() => handleChooseRegisteredUser(x.username)}
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

const RightPanelToolbar = styledComponents.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 35px;
  padding-top: 25px;
`

const RightPanelTitle = styledComponents.span`
  color: #000000;
  font-size: 1.5em;
  font-weight: 600;
`

const RightPanelToolbarAction = styledComponents.button`
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
  padding: 10px 35px;
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
  padding: 10px 35px;
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
  color: #006EFF;
  background-color: #CCE2FF;
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
  comments: state.comments,
  users: state.users,
}))(WatcherChooser);