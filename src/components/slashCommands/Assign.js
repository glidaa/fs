import React, { useState, useEffect } from 'react';
import styledComponents from "styled-components"
import { connect } from "react-redux";
import { API, graphqlOperation } from "aws-amplify";
import * as tasksActions from "../../actions/tasks"
import { AuthState } from "@aws-amplify/ui-components";
import { assignTask } from "../../graphql/mutations";

const Assign = (props) => {
  const {
    app: {
      selectedTask
    },
    commandParam,
    user,
    tasks,
    dispatch
  } = props

  const [results, setResults] = useState([])

  const handleAssignTask = async (username) => {
    const prevAssignees = [...tasks[selectedTask].assignees]
    dispatch(tasksActions.updateTask({
      id: selectedTask,
      assignees: [...new Set([...prevAssignees, username])]
    }))
    if (user.state === AuthState.SignedIn) {
      try {
        await API.graphql(graphqlOperation(assignTask, {
          taskID: selectedTask,
          assignee: username
        }))
        //closeChooser()
      } catch {
        dispatch(tasksActions.updateTask({
          id: selectedTask,
          assignees: prevAssignees
        }))
      }
    } else {
      //closeChooser()
    }
  }
  useEffect(() => {
    if (user.state === AuthState.SignedIn && commandParam) {
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
        { firstName: { matchPhrasePrefix: commandParam } },
        { email: { matchPhrasePrefix: commandParam } }
      ]}
      API.graphql(graphqlOperation(query, { filter })).then(res => setResults(res.data.searchUsers.items || []))
    } else {
      setResults([])
    }
  }, [commandParam])

  
  const handleChooseRegisteredUser = (username) => {
    handleAssignTask(`user:${username}`)
  }
  const handleChooseAnonymousUser = () => {
    handleAssignTask(`anonymous:${commandParam}`)
  }

  return (
    <>
      {commandParam && <AssigneeSuggestion
        key="::anonymous::"
        onClick={handleChooseAnonymousUser}
      >
        <LetterAvatar>{commandParam[0].toUpperCase()}</LetterAvatar>
        <div>
          <span>{commandParam}</span>
          <span>Anonymous Assignee</span>
        </div>
      </AssigneeSuggestion>}
      {results.map(x => (
        <AssigneeSuggestion
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
        </AssigneeSuggestion>
      ))}
    </>
  );
};

const AssigneeSuggestion = styledComponents.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  transition: background-color 0.2s;
  cursor: pointer;
  & > div {
    display: flex;
    flex-direction: column;
    & > span:nth-child(1) {
      color: #222222;
      font-weight: 600;
      font-size: 14px;
    }
    & > span:nth-child(2) {
      color: #222222;
      font-weight: 400;
      font-size: 12px;
    }
  }
  &:hover {
    background-color: #F5F5F5;
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
	app: state.app,
	user: state.user
}))(Assign);