import React, { useState, useEffect } from 'react';
import styles from "./Assign.module.scss"
import { useDispatch, useSelector } from "react-redux";
import * as usersActions from "../../actions/users";
import * as tasksActions from "../../actions/tasks"
import { ReactComponent as MailIcon } from "@fluentui/svg-icons/icons/mail_28_regular.svg";
import { AuthState } from "../../constants";
import Avatar from '../UI/Avatar';
import ListItem from '../UI/ListItem';

const Assign = (props) => {
  const {
    onCommandChange,
    commandParam,
  } = props

  const dispatch = useDispatch();

  const selectedTask = useSelector(state => state.app.selectedTask);
  const anonymousAssignees = useSelector(state => state.tasks[selectedTask].anonymousAssignees);
  const invitedAssignees = useSelector(state => state.tasks[selectedTask].invitedAssignees);

  const user = useSelector(state => state.user);

  const users = useSelector(state => state.users);

  const [results, setResults] = useState([])
  const [selection, setSelection] = useState(0)

  const isSuggestedAnnonymous = commandParam && !anonymousAssignees.includes(commandParam);
  const isSuggestedInvitable = commandParam?.match(/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/)
    && !invitedAssignees.includes(commandParam);
  const anonymousSelection = isSuggestedAnnonymous ? 0 : -1;
  const invitableSelection = (isSuggestedInvitable ? 1 : 0) + anonymousSelection;
  const assigneeSelectionPadding = invitableSelection + 1;

  const handleAddAssignee = async (username) => {
    dispatch(tasksActions.handleAddAssignee(selectedTask, username))
    onCommandChange(null)
  }
  const handleAddInvitedAssignee = async (email) => {
    dispatch(tasksActions.handleAddInvitedAssignee(selectedTask, email))
    onCommandChange(null)
  }
  const handleAddAnonymousAssignee = async (username) => {
    dispatch(tasksActions.handleAddAnonymousAssignee(selectedTask, username))
    onCommandChange(null)
  }
  useEffect(() => {
    const nextKeyword = commandParam?.trim()
    if (user.state === AuthState.SignedIn && nextKeyword) {
      dispatch(usersActions.handleSearchUsers(nextKeyword, selectedTask, "toAssign")).then(res => setResults(res))
    } else {
      setResults([])
    }
  }, [commandParam])

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === "Enter") {
        e.preventDefault()
        e.stopPropagation()
        if (selection === anonymousSelection) {
          handleAddAnonymousAssignee(commandParam.trim())
        } else if (selection === invitableSelection) {
          handleAddInvitedAssignee(commandParam.trim())
        } else {
          handleAddAssignee(results[selection - assigneeSelectionPadding]) 
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        e.stopPropagation()
        if (selection > 0) {
          setSelection(selection - 1)
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        e.stopPropagation()
        if (selection < results.length + assigneeSelectionPadding - 1) {
          setSelection(selection + 1)
        }
      }
    }
    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [selection, results])

  useEffect(() => {
    setSelection(0)
  }, [commandParam])

  return (
    <>
      {!commandParam && (
        <span className={styles.NoKeyword}>
          Search For Assignees
        </span>
      )}
      {isSuggestedAnnonymous && (
        <ListItem
          key="::anonymous::"
          primaryLabel={commandParam.trim()}
          secondaryLabel={"Anonymous Assignee"}
          prefix={(
            <Avatar 
              initials={commandParam.trim().charAt(0).toUpperCase()}
              alt={commandParam.trim()}
              size={32}
              circular
            />
          )}
          onHover={() => setSelection(0)}
          hovered={selection === 0}
          onSelect={() => handleAddAnonymousAssignee(commandParam.trim())}
        />
      )}
      {isSuggestedInvitable && (
        <ListItem
          key="::invited::"
          primaryLabel={commandParam.trim()}
          secondaryLabel={"Assign & invite to Forwardslash"}
          prefix={(
            <Avatar 
              icon={MailIcon}
              alt={commandParam}
              size={32}
              circular
            />
          )}
          onHover={() => setSelection(invitableSelection)}
          hovered={selection === invitableSelection}
          onSelect={() => handleAddInvitedAssignee(commandParam.trim())}
        />
      )}
      {results.map((x, i) => (
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
          onHover={() => setSelection(i + assigneeSelectionPadding)}
          hovered={selection === i + assigneeSelectionPadding}
          onSelect={() => handleAddAssignee(x)}
        />
      ))}
    </>
  );
};

export default Assign;