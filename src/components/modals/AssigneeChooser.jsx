import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import * as usersActions from "../../actions/users";
import styles from "./AssigneeChooser.module.scss"
import * as tasksActions from "../../actions/tasks"
import { AuthState } from "../../constants";
import { ReactComponent as MailIcon } from "@fluentui/svg-icons/icons/mail_28_regular.svg";
import { ReactComponent as SearchIcon } from "@fluentui/svg-icons/icons/search_16_regular.svg";
import { ReactComponent as AssigneeSearchIllustartion } from "../../assets/undraw_People_search_re_5rre.svg"
import { ReactComponent as NoResultsIllustartion } from "../../assets/undraw_not_found_60pq.svg"
import Avatar from '../UI/Avatar';
import Illustration from '../UI/Illustration';
import { useModal } from '../ModalManager';
import Modal from '../UI/Modal';
import TextField from '../UI/fields/TextField';
import ListItem from '../UI/ListItem';

const AssigneeChooser = () => {
  const dispatch = useDispatch();

  const userState = useSelector(state => state.user.state);

  const tasks = useSelector(state => state.tasks);

  const users = useSelector(state => state.users);

  const selectedTask = useSelector(state => state.app.selectedTask);
  const selectedTasks = useSelector(state => state.app.selectedTasks);

  const [keyword, setKeyword] = useState("")
  const [results, setResults] = useState([])
  const [isBusy, setIsBusy] = useState(false)
  const [pendingUser, setPendingUser] = useState(null)
  const [pendingUserType, setPendingUserType] = useState(null)
  const { modalRef, hideModal } = useModal();

  const handleAddAssignee = async (username) => {
    setPendingUser(username)
    setPendingUserType("assignee")
    setIsBusy(true)
    try {
      if (selectedTask) {
        await dispatch(tasksActions.handleAddAssignee(selectedTask, username))
      } else if (selectedTasks) {
        for (const task of selectedTasks) {
          await dispatch(tasksActions.handleAddAssignee(task, username))
        }
      }
      hideModal()
    } catch {
      setIsBusy(false)
      setPendingUser(null)
      setPendingUserType(null)
    }
  }
  const handleAddAnonymousAssignee = async (username) => {
    setPendingUser(username)
    setPendingUserType("anonymousAssignee")
    setIsBusy(true)
    try {
      if (selectedTask) {
        await dispatch(tasksActions.handleAddAnonymousAssignee(selectedTask, username))
      } else if (selectedTasks) {
        for (const task of selectedTasks) {
          await dispatch(tasksActions.handleAddAnonymousAssignee(task, username))
        }
      }
      hideModal()
    } catch {
      setIsBusy(false)
      setPendingUser(null)
      setPendingUserType(null)
    }
  }
  const handleAddInvitedAssignee = async (username) => {
    setPendingUser(username)
    setPendingUserType("invitedAssignee")
    setIsBusy(true)
    try {
      if (selectedTask) {
        await dispatch(tasksActions.handleAddInvitedAssignee(selectedTask, username))
      } else if (selectedTasks) {
        for (const task of selectedTasks) {
          await dispatch(tasksActions.handleAddInvitedAssignee(task, username))
        }
      }
      hideModal()
    } catch {
      setIsBusy(false)
      setPendingUser(null)
      setPendingUserType(null)
    }
  }
  const handleChangeKeyword = (e) => {
    const nextKeyword = e.target.value
    if (!keyword) {
      setResults([])
    }
    setKeyword(nextKeyword)
    if (userState === AuthState.SignedIn && nextKeyword.trim()) {
      dispatch(usersActions.handleSearchUsers(nextKeyword, selectedTask || selectedTasks[0], "toAssign")).then(res => setResults(res))
    } else {
      setResults([])
    }
  }
  return (
    <Modal
      title="Add Assignee"
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
            style={{
              marginRight: 5
            }}
            fill="currentColor"
          />
        )}
      />
      <div className={styles.SearchResults}>
        {keyword &&
        ((pendingUser === keyword.trim() && pendingUserType === "anonymousAssignee") ||
        !tasks[selectedTask || selectedTasks[0]].anonymousAssignees.includes(keyword.trim())) && (
          <ListItem
            key="::anonymous::"
            primaryLabel={keyword.trim()}
            secondaryLabel={"Anonymous Assignee"}
            prefix={(
              <Avatar 
                initials={keyword.trim().charAt(0).toUpperCase()}
                alt={keyword.trim()}
                size={32}
                circular
              />
            )}
            disabled={isBusy}
            onSelect={() => handleAddAnonymousAssignee(keyword.trim())}
          />
        )}
        {userState === AuthState.SignedIn &&
        keyword.match(/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/) &&
        ((pendingUser === keyword.trim() && pendingUserType === "invitedAssignee") ||
        !tasks[selectedTask || selectedTasks[0]].invitedAssignees.includes(keyword.trim())) && (
          <ListItem
            key="::invited::"
            primaryLabel={keyword.trim()}
            secondaryLabel={"Assign & invite to Forwardslash"}
            prefix={(
              <Avatar 
                icon={MailIcon}
                alt={keyword}
                size={32}
                circular
              />
            )}
            disabled={isBusy}
            onSelect={() => handleAddInvitedAssignee(keyword.trim())}
          />
        )}
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
            onSelect={() => handleAddAssignee(x)}
          />
        ))}
        {!keyword && (
          <Illustration
            illustration={AssigneeSearchIllustartion}
            title="Search For A User To Assign"
            secondary
          />
        )}
        {keyword &&
        !results.length &&
        (pendingUser !== keyword.trim() && pendingUserType !== "anonymousAssignee") &&
        tasks[selectedTask || selectedTasks[0]].assignees.includes(`anonymous:${keyword.trim()}`) && (
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

export default AssigneeChooser;
