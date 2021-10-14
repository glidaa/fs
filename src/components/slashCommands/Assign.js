import React, { useState, useEffect } from 'react';
import styled from "styled-components"
import { connect } from "react-redux";
import { API, graphqlOperation } from "aws-amplify";
import * as appActions from "../../actions/app"
import * as tasksActions from "../../actions/tasks"
import { AuthState } from "../../constants";
import Avatar from '../UI/Avatar';

const Assign = (props) => {
  const {
    app: {
      selectedTask
    },
    commandParam,
    user,
    dispatch
  } = props

  const [results, setResults] = useState([])
  const [selection, setSelection] = useState(0)

  const handleAssignTask = async (username) => {
    dispatch(tasksActions.handleAssignTask(selectedTask, username))
    dispatch(appActions.setCommand(""))
  }
  useEffect(() => {
    if (user.state === AuthState.SignedIn && commandParam) {
      const firstLastName = commandParam.split(/\s+/)
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
        { username: { matchPhrasePrefix: commandParam } },
        ...((firstLastName.length !== 2 && [{
          firstName: { matchPhrasePrefix: commandParam }
        }]) || []),
        ...((firstLastName.length === 2 && [{
          and: [
            { firstName: { matchPhrasePrefix: firstLastName[0] } },
            { lastName: { matchPhrasePrefix: firstLastName[1] } },
          ]
        }]) || []),
        { email: { matchPhrasePrefix: commandParam } }
      ]}
      API.graphql(graphqlOperation(query, { filter })).then(res => setResults(res.data.searchUsers.items || []))
    } else {
      setResults([])
    }
  }, [commandParam])

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === "Enter") {
        if (selection === 0) {
          handleAssignTask(`anonymous:${commandParam}`) 
        } else {
          handleAssignTask(`user:${results[selection - 1].username}`) 
        }
      } else if (e.key === "ArrowUp") {
        if (selection > 0) {
          setSelection(selection - 1)
        }
      } else if (e.key === "ArrowDown") {
        if (selection < results.length) {
          setSelection(selection + 1)
        }
      }
    }
    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [selection, results])

  useEffect(() => {
    setSelection(0)
  }, [commandParam])

  return (
    <>
      {!commandParam && <NoKeyword>Search For Assignees</NoKeyword>}
      {commandParam && <AssigneeSuggestion
        key="::anonymous::"
        isSelected={selection === 0}
        onMouseEnter={() => setSelection(0)}
        onClick={() => handleAssignTask(`anonymous:${commandParam}`)}
      >
        <Avatar user={{name: commandParam[0]}} size={32} circular />
        <div>
          <span>{commandParam}</span>
          <span>Anonymous Assignee</span>
        </div>
      </AssigneeSuggestion>}
      {results.map((x, i) => (
        <AssigneeSuggestion
          key={x.username}
          isSelected={selection === i + 1}
          onMouseEnter={() => setSelection(i + 1)}
          onClick={() => handleAssignTask(`user:${x.username}`)}
        >
          <Avatar user={x} size={32} circular />
          <div>
            <span>{`${x.firstName} ${x.lastName}`}</span>
            <span>{x.email}</span>
          </div>
        </AssigneeSuggestion>
      ))}
    </>
  );
};

const AssigneeSuggestion = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 20px;
  background-color: ${({ isSelected }) => isSelected ? "#F5F5F5" : "transparent"};
  transition: background-color 0.2s;
  cursor: pointer;
  & > div {
    display: flex;
    flex-direction: column;
    & > span:nth-child(1) {
      color: ${({theme})=> theme.txtColor};
      font-weight: 600;
      font-size: 14px;
    }
    & > span:nth-child(2) {
      color: ${({theme})=> theme.txtColor};
      font-weight: 400;
      font-size: 12px;
    }
  }
  & > *:not(:last-child) {
    margin-right: 10px;
  }
`

const NoKeyword = styled.span`
  display: flex;
  width: 100%;
  font-size: 14px;
  align-items: center;
  justify-content: center;
`

export default connect((state) => ({
	app: state.app,
	user: state.user
}))(Assign);