import React, { useMemo } from 'react';
import { useDispatch, useSelector } from "react-redux"
import * as tasksActions from "../../../actions/tasks"
import { useModal } from '../../ModalManager';
import modals from '../../modals';
import UsersField from './UsersField';

const WatcherField = (props) => {
  const {
    name,
    label,
    emptyMsg = "No Watchers Added Yet",
    value,
    readOnly,
  } = props

  const { showModal } = useModal();
  const dispatch = useDispatch();

  const selectedTask = useSelector(state => state.app.selectedTask)
  const selectedTasks = useSelector(state => state.app.selectedTasks)

  const users = useSelector(state => state.users)

  const handleRemoveWatcher = (username) => {
    if (selectedTask) {
      dispatch(tasksActions.handleRemoveWatcher(selectedTask, username))
    } else if (selectedTasks) {
      for (const task of selectedTasks) {
        dispatch(tasksActions.handleRemoveWatcher(task, username))
      }
    }
  }

  const getWatchersValue = (users, watchers) => {
    return watchers.map((watcher) => ({
      username: watcher,
      firstName: users[watcher].firstName,
      lastName: users[watcher].lastName,
      initials: users[watcher].initials,
      avatar: users[watcher].avatar,
    }));
  };

  const watchersValue = useMemo(() => getWatchersValue(users, value), [users, value]);

  return (
    <UsersField
      name={name}
      label={label}
      emptyMsg={emptyMsg}
      onAdd={() => showModal(modals.WATCHER_CHOOSER)}
      onRemove={handleRemoveWatcher}
      value={watchersValue}
      readOnly={readOnly}
    />
  )
}

export default WatcherField;