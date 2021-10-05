import React, { useEffect, useRef } from 'react';
import { connect } from "react-redux"
import styledComponents from "styled-components";
import * as tasksActions from "../../../actions/tasks"
import * as appActions from "../../../actions/app";
import { ReactComponent as RemoveIcon } from "../../../assets/close-outline.svg"
import { panelPages } from "../../../constants";
import ShadowScroll from '../../ShadowScroll';
import Avatar from '../Avatar';

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
      <WatcherFieldContainer>
        {(value.length) ? (
          <> 
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
                    color="#006EFF"
                  />
                </RemoveBtn>
                <Avatar user={users[x]} size={32} circular />
                <WatcherDetails>
                  <span>{users[x].firstName}</span>
                  <span>@{x}</span>
                </WatcherDetails>
              </WatcherItem>
            ))}
          </>
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
      </WatcherFieldContainer>
    </WatcherFieldShell>
  )
}

const WatcherFieldShell = styledComponents.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 5px;
  & > label {
    color: #222222;
    margin-bottom: 0;
    width: max-content;
    font-size: 14px;
    font-weight: 600;
  }
`

const WatcherFieldContainer = styledComponents(ShadowScroll)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
  overflow: hidden;
  width: 100%;
  scroll-behavior: smooth;
`

const NewWatcherBtn = styledComponents.button`
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
  height: 91.8px;
  min-width: 80px;
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

const NoWatchers = styledComponents.div`
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

const WatcherItem = styledComponents.span`
  position: relative;
  display: flex;
  gap: 5px;
  padding: 10px;
  border-radius: 8px;
  min-width: 80px;
  max-width: 80px;
  color: #5D6969;
  border: 1px solid #C0C0C0;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
  background-color: #FFFFFF;
  flex-direction: column;
  align-items: center;
`

const WatcherDetails = styledComponents.div`
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

const RemoveBtn = styledComponents.button`
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