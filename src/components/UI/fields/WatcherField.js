import React, { useEffect, useRef } from 'react';
import { connect } from "react-redux"
import styles from "./WatcherField.module.scss"
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
    <div className={styles.WatcherFieldShell} style={style}>
      {label && (
        <label htmlFor={name}>
          {label}
        </label>
      )}
      {(value.length) ? (
        <ShadowScroll>
          {!readOnly && (
            <button
              className={styles.NewWatcherBtn}
              onClick={openChooser}
            >
              <div>+</div>
              <span>Add</span>
            </button>
          )}
          {value.map(x => (
            <span className={styles.WatcherItem} key={x}>
              <button
                className={styles.RemoveBtn}
                onClick={() => handleRemoveWatcher(x)}
              >
                <RemoveIcon
                  height={16}
                  width={16}
                />
              </button>
              <Avatar user={users[x]} size={36} circular />
              <div className={styles.WatcherDetails}>
                <span>{users[x].firstName}</span>
                <span>@{x}</span>
              </div>
            </span>
          ))}
        </ShadowScroll>
      ) : (
        <div className={styles.NoWatchers}>
          <span>No Watchers Added Yet</span>
          {!readOnly && (
            <button onClick={openChooser}>
              + Add Watcher
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default connect((state) => ({
    app: state.app,
    users: state.users
  }))(WatcherField);