import React, { useMemo, useEffect, useRef } from 'react';
import { API, graphqlOperation } from "aws-amplify";
import { connect } from "react-redux"
import styledComponents from "styled-components";
import * as tasksActions from "../actions/tasks"
import { unassignTask } from "../graphql/mutations";
import * as appActions from "../actions/app";
import { NOT_ASSIGNED, panelPages } from "../constants";

const AssigneeField = (props) => {
  const {
    value,
    readOnly,
    app: {
      selectedTask
    },
    users,
    dispatch
  } = props

  const assigneeFieldRef = useRef(null)

  useEffect(() => {
    if (assigneeFieldRef.current) {
      assigneeFieldRef.current.addEventListener("wheel", (e) => {
        e.preventDefault();
        assigneeFieldRef.current.scrollLeft += e.deltaY;
      }, {passive: true});
    }
  }, [assigneeFieldRef])

  const openChooser = () => {
    return dispatch(appActions.setRightPanelPage(panelPages.ASSIGNEE_CHOOSER))
  }

  const processValue = (value, users) => {
    const result = []
    for (const assignee of value) {
      const isValidAssignee = /^(user|anonymous):(.*)$/.test(assignee)
      if (isValidAssignee) {
        const [, assigneeType, assigneeID] = assignee.match(/(user|anonymous):(.*)/)
        const isUser = assigneeType === "user"
        if (isUser) {
          result.push({...users[assigneeID], isUser})
        } else {
          result.push({ name: assigneeID, isUser })
        }
      }
    }
    return result
  }

  const processedValue = useMemo(() => processValue(value, users), [value, users]);

  const handleUnassignTask = (username) => {
    dispatch(tasksActions.updateTask({
      id: selectedTask,
      assignee: NOT_ASSIGNED
    }))
    API.graphql(graphqlOperation(unassignTask, {
      taskID: selectedTask,
      assignee: username
    })).catch(() => {
      dispatch(tasksActions.updateTask({
        id: selectedTask,
        assignee: username
      }))
    })
  }

  return (
    <AssigneeFieldShell ref={assigneeFieldRef}>
      {(processedValue.length) ? (
        <> 
          {!readOnly && (
            <NewAssigneeBtn onClick={openChooser}>
              <div>+</div>
              <span>Assign</span>
            </NewAssigneeBtn>
          )}
          {processedValue.map(x => (
            <AssigneeItem key={x}>
              {x.isUser && (x.avatar ?
                <ImageAvatar src={x.avatar} /> :
                <LetterAvatar>{x.abbr}</LetterAvatar>
              )}
              {!x.isUser && <LetterAvatar>{x.name[0].toUpperCase()}</LetterAvatar>}
              <span>{x.firstName || x.name}</span>
            </AssigneeItem>
          ))}
        </>
      ) : (
        <NoAssignees>
          <span>No Users Assigned Yet</span>
          <button onClick={openChooser}>+ Add Assignee</button>
        </NoAssignees>
      )}
    </AssigneeFieldShell>
  )
}

const AssigneeFieldShell = styledComponents.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
  overflow: hidden;
  width: 100%;
  scroll-behavior: smooth;
`

const NewAssigneeBtn = styledComponents.button`
  display: flex;
  gap: 5px;
  padding: 10px 15px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 20px;
  background-color: #FFFFFF;
  outline: none;
  min-width: 92px;
  height: 80px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #006EFF;
  & > div {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
    border-radius: 100%;
    color: #FFFFFF;
    background-color: #006EFF;
    min-width: 32px;
    min-height: 32px;
    width: 32px;
    height: 32px;
  }
  & > span {
    color: #006EFF;
    font-weight: 600;
    font-size: 14px;
  }
`

const NoAssignees = styledComponents.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  background-color: transparent;
  outline: none;
  height: fit-content;
  border: 1px solid #C0C0C0;
  & > span {
    font-weight: 600;
    font-size: 14px;
    color: #222222;
  }
  & > button {
    outline: none;
    border: none;
    background-color: #CCE2FF;
    color: #006EFF;
    padding: 5px 10px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
  }
`

const AssigneeItem = styledComponents.span`
  display: flex;
  gap: 5px;
  padding: 10px 15px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9em;
  min-width: 60px;
  max-width: 60px;
  color: #5D6969;
  border: 1px solid #C0C0C0;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
  background-color: #FFFFFF;
  flex-direction: column;
  align-items: center;
  & > span {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 60px;
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
    users: state.users
  }))(AssigneeField);