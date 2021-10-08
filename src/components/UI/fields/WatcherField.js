import React, { useEffect, useRef } from 'react';
import { connect } from "react-redux"
import styled from "styled-components";
import * as tasksActions from "../../../actions/tasks"
import * as appActions from "../../../actions/app";
import { ReactComponent as RemoveIcon } from "../../../assets/close-outline.svg"
import { panelPages } from "../../../constants";
import ShadowScroll from '../../ShadowScroll';
import Avatar from '../Avatar';
import { glassmorphism } from '../../../styles';

const WatcherField = (props) => {
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

  const watcherFieldRef = useRef(null)

  useEffect(() => {
    if (watcherFieldRef.current) {
      watcherFieldRef.current.addEventListener("wheel", (e) => {
        e.preventDefault();
        watcherFieldRef.current.scrollLeft += e.deltaY;
      });
    }
  }, [watcherFieldRef])

  const openChooser = () => {
    return dispatch(appActions.setRightPanelPage(panelPages.WATCHER_CHOOSER))
  }

  const handleRemoveWatcher = (username) => {
    dispatch(tasksActions.handleRemoveWatcher(selectedTask, username))
  }

  return (
    <WatcherFieldShell style={style}>
      <label htmlFor={name}>
        {label}
      </label>
      {(value.length) ? (
        <ShadowScroll>
          {!readOnly && (
            <NewWatcherBtn onClick={openChooser}>
              <div>+</div>
              <span>Add</span>
            </NewWatcherBtn>
          )}
          {value.map(x => (
            <WatcherItem key={x}>
              <RemoveBtn onClick={() => handleRemoveWatcher(x)}>
                <RemoveIcon
                  height="16"
                  width="16"
                  strokeWidth="32"
                  color="var(--primary)"
                />
              </RemoveBtn>
              <Avatar user={users[x]} size={36} circular />
              <WatcherDetails>
                <span>{users[x].firstName}</span>
                <span>@{x}</span>
              </WatcherDetails>
            </WatcherItem>
          ))}
        </ShadowScroll>
      ) : (
        <NoWatchers>
          <span>No Watchers Added Yet</span>
          {!readOnly && (
            <button onClick={openChooser}>
              + Add Watcher
            </button>
          )}
        </NoWatchers>
      )}
    </WatcherFieldShell>
  )
}

const WatcherFieldShell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 5px;
  & > label {
    color: #000000;
    margin-bottom: 0;
    width: max-content;
    font-size: 14px;
    font-weight: 600;
  }
`

const NewWatcherBtn = styled.button`
  display: flex;
  gap: 5px;
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
  ${glassmorphism(8)}
  & > div {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
    border-radius: 100%;
    color: #FFFFFF;
    background-color: var(--primary);
    min-width: 32px;
    min-height: 32px;
    width: 32px;
    height: 32px;
  }
  & > span {
    color: var(--primary);
    font-weight: 600;
    font-size: 14px;
  }
`

const NoWatchers = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  justify-content: center;
  width: calc(100% - 20px);
  padding: 10px;
  ${glassmorphism(8)}
  border: none;
  outline: none;
  height: fit-content;
  & > span {
    font-weight: 600;
    font-size: 14px;
    color: #000000;
  }
  & > button {
    outline: none;
    ${glassmorphism(8)}
    border: none;
    color: var(--primary);
    padding: 5px 10px;
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
  }
`

const WatcherItem = styled.span`
  position: relative;
  display: flex;
  gap: 5px;
  padding: 10px;
  min-width: 80px;
  max-width: 80px;
  color: #5D6969;
  ${glassmorphism(8)}
  flex-direction: column;
  align-items: center;
  &:last-child {
    margin-right: 5px;
  }
`

const WatcherDetails = styled.div`
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
  background-color: transparent;
  cursor: pointer;
`

export default connect((state) => ({
    app: state.app,
    users: state.users
  }))(WatcherField);