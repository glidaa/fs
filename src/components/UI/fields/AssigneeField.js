import React, { useMemo, useEffect, useRef, useContext } from 'react';
import { connect } from "react-redux"
import styled, { ThemeContext } from "styled-components";
import * as tasksActions from "../../../actions/tasks"
import * as appActions from "../../../actions/app";
import { ReactComponent as RemoveIcon } from "../../../assets/close-outline.svg"
import { panelPages } from "../../../constants";
import ShadowScroll from '../../ShadowScroll';
import Avatar from '../Avatar';

const AssigneeField = (props) => {
  const {
    label,
    name,
    value,
    readOnly,
    style,
    app: {
      selectedTask
    },
    users,
    dispatch
  } = props

  const themeContext = useContext(ThemeContext);
  const assigneeFieldRef = useRef(null)

  useEffect(() => {
    if (assigneeFieldRef.current) {
      assigneeFieldRef.current.addEventListener("wheel", (e) => {
        e.preventDefault();
        assigneeFieldRef.current.scrollLeft += e.deltaY;
      });
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
          result.push({...users[assigneeID], username: assigneeID, raw: assignee, isUser})
        } else {
          result.push({ name: assigneeID, raw: assignee, isUser })
        }
      }
    }
    return result
  }

  const processedValue = useMemo(() => processValue(value, users), [value, users]);

  const handleUnassignTask = (username) => {
    dispatch(tasksActions.handleUnassignTask(selectedTask, username))
  }

  return (
    <AssigneeFieldShell style={style}>
      {label && (
        <label htmlFor={name}>
          {label}
        </label>
      )}
      {(processedValue.length) ? (
        <ShadowScroll>
          {!readOnly && (
            <NewAssigneeBtn onClick={openChooser}>
              <div>+</div>
              <span>Assign</span>
            </NewAssigneeBtn>
          )}
          {processedValue.map(x => (
            <AssigneeItem key={x.raw}>
              <RemoveBtn onClick={() => handleUnassignTask(x.raw)}>
                <RemoveIcon
                  height="16"
                  width="16"
                  strokeWidth="32"
                  color={themeContext.primary}
                />
              </RemoveBtn>
              <Avatar user={x} size={36} circular />
              <AssigneeDetails>
                <span>{x.firstName || x.name}</span>
                <span>{x.username ? `@${x.username}` : "Anonymous"}</span>
              </AssigneeDetails>
            </AssigneeItem>
          ))}
        </ShadowScroll>
      ) : (
        <NoAssignees>
          <span>No Users Assigned Yet</span>
          {!readOnly && (
            <button onClick={openChooser}>
              + Add Assignee
            </button>
          )}
        </NoAssignees>
      )}
    </AssigneeFieldShell>
  )
}

const AssigneeFieldShell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  & > label {
    color: ${({theme})=> theme.txtColor};
    margin-bottom: 0;
    width: max-content;
    font-size: 14px;
    font-weight: 600;
  }
  & > *:not(:last-child) {
    margin-bottom: 5px;
  }
`

const NewAssigneeBtn = styled.button`
  position: relative;
  display: flex;
  padding: 10px 15px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border: none;
  outline: none;
  height: 91.8px;
  min-width: 80px;
  font-weight: 500;
  cursor: pointer;
  margin-left: 5px;
  border-radius: 8px;
  & > div {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
    border-radius: 100%;
    color: #FFFFFF;
    background-color: ${({theme})=> theme.primary};
    min-width: 32px;
    min-height: 32px;
    width: 32px;
    height: 32px;
  }
  & > span {
    color: ${({theme})=> theme.primary};
    font-weight: 600;
    font-size: 14px;
  }
  & > *:not(:last-child) {
    margin-bottom: 5px;
  }
`

const NoAssignees = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: calc(100% - 20px);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #C0C0C0;
  outline: none;
  height: fit-content;
  & > span {
    font-weight: 600;
    font-size: 14px;
    color: ${({theme})=> theme.txtColor};
  }
  & > button {
    position: relative;
    outline: none;
    border: none;
    color: ${({theme})=> theme.primary};
    padding: 5px 10px;
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
    border-radius: 8px;
    background-color: ${({theme})=> theme.primaryLight};
  }
  & > *:not(:last-child) {
    margin-bottom: 5px;
  }
`

const AssigneeItem = styled.span`
  position: relative;
  display: flex;
  padding: 10px;
  min-width: 80px;
  max-width: 80px;
  color: #5D6969;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  &:last-child {
    margin-right: 5px;
  }
  & > *:not(:last-child) {
    margin-bottom: 5px;
  }
`

const AssigneeDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & > span {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 80px;
    line-height: 1.2;
  }
  & > span:nth-child(1) {
    font-size: 14px;
    font-weight: 600;
  }
  & > span:nth-child(2) {
    font-size: 10px;
    font-weight: 400;
  }
`

const RemoveBtn = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  outline: none;
  border: none;
  line-height: 0;
  padding: 0;
  background-color: ${({theme})=> theme.secondaryBg};
  cursor: pointer;
`

export default connect((state) => ({
    app: state.app,
    users: state.users
  }))(AssigneeField);