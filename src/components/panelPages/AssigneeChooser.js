import React, { useState, useMemo } from 'react';
import { connect } from "react-redux";
import { API, graphqlOperation } from "aws-amplify";
import * as appActions from "../../actions/app";
import styled from "styled-components";
import * as tasksActions from "../../actions/tasks"
import { panelPages, AuthState } from "../../constants";
import { ReactComponent as BackArrowIcon } from "../../assets/chevron-back-outline.svg";
import { ReactComponent as ShareIcon } from "../../assets/share-outline.svg"
import { ReactComponent as AssigneeSearchIllustartion } from "../../assets/undraw_People_search_re_5rre.svg"
import { ReactComponent as NoResultsIllustartion } from "../../assets/undraw_not_found_60pq.svg"
import Avatar from '../UI/Avatar';

const AssigneeChooser = (props) => {
  const {
    app: {
      selectedTask
    },
    tasks,
    user,
    dispatch
  } = props;

  const [keyword, setKeyword] = useState("")
  const [results, setResults] = useState([])
  const [isBusy, setIsBusy] = useState(false)
  const [pendingUser, setPendingUser] = useState(null)

  const closeChooser = () => {
    return dispatch(appActions.setRightPanelPage(panelPages.TASK_HUB))
  }
  const handleAssignTask = async (username) => {
    setPendingUser(username)
    setIsBusy(true)
    try {
      await dispatch(tasksActions.handleAssignTask(selectedTask, username))
      closeChooser()
    } catch {
      setIsBusy(false)
      setPendingUser(null)
    }
  }
  const filterResults = (results, tasks, selectedTask) => {
    const currAssignees = tasks[selectedTask].assignees.filter(x => /^user:.*$/.test(x) & x !== pendingUser)
    return results.filter(x => !currAssignees.includes(`user:${x.username}`))
  }
  const filteredResults = useMemo(
    () => filterResults(results, tasks, selectedTask),
    [results, tasks, selectedTask]
  )
  const handleChangeKeyword = (e) => {
    const nextKeyword = e.target.value
    if (!keyword) {
      setResults([])
    }
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
        <PanelPageToolbarAction
          onClick={closeChooser}
          disabled={isBusy}
        >
          <BackArrowIcon
              width="24"
              height="24"
              strokeWidth="32"
              color="#006EFF"
          />
        </PanelPageToolbarAction>
        <PanelPageTitle>Add Assignee</PanelPageTitle>
        <PanelPageToolbarAction
          onClick={shareTask}
          disabled={isBusy}
        >
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
        disabled={isBusy}
        value={keyword}
      />
      <SearchResults>
        {keyword &&
        (pendingUser === `anonymous:${keyword.trim()}` ||
        !tasks[selectedTask].assignees.includes(`anonymous:${keyword.trim()}`)) && (
          <SearchResultsItem
            key="::anonymous::"
            disabled={isBusy}
            onClick={() => handleAssignTask(`anonymous:${keyword.trim()}`)}
          >
            <Avatar user={{name: keyword}} size={32} circular />
            <div>
              <span>{keyword.trim()}</span>
              <span>Anonymous Assignee</span>
            </div>
          </SearchResultsItem>
        )}
        {keyword && filteredResults.map(x => (
          <SearchResultsItem
            key={x.username}
            disabled={isBusy}
            onClick={() => handleAssignTask(`user:${x.username}`)}
          >
            <Avatar user={x} size={32} circular />
            <div>
              <span>{`${x.firstName} ${x.lastName}`}</span>
              <span>@{x.username}</span>
            </div>
          </SearchResultsItem>
        ))}
        {!keyword && (
          <AssigneeChooserIllustartion>
            <AssigneeSearchIllustartion />
            <span>
              Search For A User To Assign
            </span>
          </AssigneeChooserIllustartion>
        )}
        {keyword &&
        !filteredResults.length &&
        pendingUser !== `anonymous:${keyword.trim()}` &&
        tasks[selectedTask].assignees.includes(`anonymous:${keyword.trim()}`) && (
          <AssigneeChooserIllustartion>
            <NoResultsIllustartion />
            <span>
              No Results Found
            </span>
          </AssigneeChooserIllustartion>
        )}
      </SearchResults>
    </>
  );
};

const PanelPageToolbar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 25px;
  padding-top: 25px;
`

const PanelPageTitle = styled.span`
  color: #000000;
  font-size: 18px;
  font-weight: 600;
`

const PanelPageToolbarAction = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  background-color: transparent;
  transition: opacity 0.3s;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`

const KeywordField = styled.input`
  width: calc(100% - 90px);
  outline: none;
  border: none;
  background-color: #F8F8F8;
  padding: 10px;
  border-radius: 8px;
  margin: 0 25px;
  font-size: 14px;
  font-weight: 400;
  transition: opacity 0.3s;
  &::placeholder {
    color: #C0C0C0;
  }
  &:disabled {
    opacity: 0.6;
  }
`

const SearchResults = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  background-color: #FFFFFF;
  border-radius: 4px;
  width: 100%;
`

const SearchResultsItem = styled.button`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  padding: 10px 25px;
  border: none;
  background-color: transparent;
  text-align: start;
  transition: background-color 0.3s, opacity 0.3s;
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
  &:not(:disabled):hover {
    background-color: #E4E4E2;
  }
  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
`

const AssigneeChooserIllustartion = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
  margin-top: -25px;
  gap: 40px;
  & > svg {
    width: 250px;
    height: auto;
  }
  & > span {
    font-weight: bold;
    font-size: 18px;
    color: #222222;
  }
`

export default connect((state) => ({
  user: state.user,
  tasks: state.tasks,
  app: state.app,
  users: state.users,
}))(AssigneeChooser);
