import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import styles from "./WatcherChooser.module.scss"
import * as tasksActions from "../../actions/tasks"
import * as usersActions from "../../actions/users"
import { AuthState } from "../../constants";
import { ReactComponent as SearchIcon } from "@fluentui/svg-icons/icons/search_16_regular.svg";
import { ReactComponent as WatcherSearchIllustartion } from "../../assets/undraw_People_search_re_5rre.svg"
import { ReactComponent as NoResultsIllustartion } from "../../assets/undraw_not_found_60pq.svg"
import Avatar from '../UI/Avatar';
import Illustration from '../UI/Illustration';
import { useModal } from '../ModalManager';
import Modal from '../UI/Modal';
import TextField from '../UI/fields/TextField';
import ListItem from '../UI/ListItem';

const WatcherChooser = () => {
  const dispatch = useDispatch();

  const userState = useSelector(state => state.user.state);

  const users = useSelector(state => state.users);

  const selectedTask = useSelector(state => state.app.selectedTask);
  const selectedTasks = useSelector(state => state.app.selectedTasks);

  const [keyword, setKeyword] = useState("")
  const [results, setResults] = useState([])
  const [isBusy, setIsBusy] = useState(false)
  const { modalRef, hideModal } = useModal();

  const handleAddWatcher = async (username) => {
    setIsBusy(true)
    try {
      if (selectedTask) {
        await dispatch(tasksActions.handleAddWatcher(selectedTask, username))
      } else if (selectedTasks) {
        for (const task of selectedTasks) {
          await dispatch(tasksActions.handleAddWatcher(task, username))
        }
      }
      hideModal()
    } catch {
      setIsBusy(false)
    }
  }
  const handleChangeKeyword = (e) => {
    const nextKeyword = e.target.value
    if (!keyword) {
      setResults([])
    }
    setKeyword(nextKeyword)
    if (userState === AuthState.SignedIn && nextKeyword.trim()) {
      dispatch(usersActions.handleSearchUsers(nextKeyword, selectedTask || selectedTasks[0], "toWatch")).then(res => setResults(res))
    } else {
      setResults([])
    }
  }
  return (
    <Modal
      title="Add Watcher"
      primaryButtonText="Cancel"
      primaryButtonDisabled={isBusy}
      onPrimaryButtonClick={hideModal}
      modalRef={modalRef}
    >
      <TextField
        type="text"
        name="keyword"
        placeholder="Start searching…"
        onChange={handleChangeKeyword}
        disabled={isBusy}
        value={keyword}
        prefix={() => (
          <SearchIcon
            fill="currentColor"
            style={{
              marginRight: 5
            }}
          />
        )}
      />
      <div className={styles.SearchResults}>
        {keyword && results.map(x => (
          <ListItem
            key={x}
            primaryLabel={`${users[x].firstName} ${users[x].lastName}`}
            secondaryLabel={`@${x}`}
            prefix={(
              <Avatar
                image={users[x].avatar}
                initials={users[x].initials}
                alt={`${users[x].firstName} ${users[x].lastName}`}
                size={32}
                circular
              />
            )}
            disabled={isBusy}
            onSelect={() => handleAddWatcher(x)}
          />
        ))}
        {!keyword && (
          <Illustration
          illustration={WatcherSearchIllustartion}
          title="Search For A Watcher"
          secondary
        />
        )}
        {keyword &&
        !results.length && (
          <Illustration
            illustration={NoResultsIllustartion}
            title="No Results Found"
            secondary
          />
        )}
      </div>
    </Modal>
  );
};

export default WatcherChooser;