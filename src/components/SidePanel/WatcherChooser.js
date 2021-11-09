import React, { useState, useMemo } from 'react';
import { connect } from "react-redux";
import { API, graphqlOperation } from "@aws-amplify/api";
import * as appActions from "../../actions/app";
import styles from "./WatcherChooser.module.scss"
import * as tasksActions from "../../actions/tasks"
import { panelPages, AuthState } from "../../constants";
import { ReactComponent as BackArrowIcon } from "../../assets/chevron-back-outline.svg";
import { ReactComponent as ShareIcon } from "../../assets/share-outline.svg"
import { ReactComponent as WatcherSearchIllustartion } from "../../assets/undraw_People_search_re_5rre.svg"
import { ReactComponent as NoResultsIllustartion } from "../../assets/undraw_not_found_60pq.svg"
import Avatar from '../UI/Avatar';

const WatcherChooser = (props) => {
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
  const handleAddWatcher = async (username) => {
    setPendingUser(username)
    setIsBusy(true)
    try {
      await dispatch(tasksActions.handleAddWatcher(selectedTask, username))
      closeChooser()
    } catch {
      setIsBusy(false)
      setPendingUser(null)
    }
  }
  const filterResults = (results, tasks, selectedTask) => {
    const currWatchers = tasks[selectedTask].watchers.filter(x => x !== pendingUser)
    return results.filter(x => !currWatchers.includes(x.username))
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
      <div className={styles.PanelPageToolbar}>
        <button
          className={styles.PanelPageToolbarAction}
          onClick={closeChooser}
          disabled={isBusy}
        >
          <BackArrowIcon
            width={24}
            height={24}
          />
        </button>
        <span className={styles.PanelPageTitle}>
          Add Watcher
        </span>
        <button
          className={styles.PanelPageToolbarAction}
          onClick={shareTask}
          disabled={isBusy}
        >
          <ShareIcon
            width={24}
            height={24}
          />
        </button>
      </div>
      <input
        className={styles.KeywordField}
        type="text"
        name="keyword"
        placeholder="Start searching…"
        onChange={handleChangeKeyword}
        disabled={isBusy}
        value={keyword}
      />
      <div className={styles.SearchResults}>
        {keyword && filteredResults.map(x => (
          <button
            className={styles.SearchResultsItem}
            key={x.username}
            disabled={isBusy}
            onClick={() => handleAddWatcher(x.username)}
          >
            <Avatar user={x} size={32} circular />
            <div>
              <span>{`${x.firstName} ${x.lastName}`}</span>
              <span>@{x.username}</span>
            </div>
          </button>
        ))}
        {!keyword && (
          <div className={styles.WatcherChooserIllustartion}>
            <WatcherSearchIllustartion />
            <span>
              Search For A Watcher
            </span>
          </div>
        )}
        {keyword &&
        !filteredResults.length && (
          <div className={styles.WatcherChooserIllustartion}>
            <NoResultsIllustartion />
            <span>
              No Results Found
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default connect((state) => ({
  user: state.user,
  tasks: state.tasks,
  app: state.app,
  users: state.users
}))(WatcherChooser);