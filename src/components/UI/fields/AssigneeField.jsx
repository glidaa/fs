import React, { useMemo } from 'react';
import { useDispatch, useSelector } from "react-redux"
import * as tasksActions from "../../../actions/tasks"
import { useModal } from '../../ModalManager';
import modals from '../../modals';
import UsersField from './UsersField';

const AssigneeField = (props) => {
  const {
    label,
    emptyMsg = "No Users Assigned Yet",
    name,
    value,
    readOnly,
  } = props

  const { showModal } = useModal();
  const dispatch = useDispatch();

  const selectedTask = useSelector(state => state.app.selectedTask)
  const selectedTasks = useSelector(state => state.app.selectedTasks)

  const users = useSelector(state => state.users)

  const handleRemoveAssignee = (e) => {
    const { value, type } = e.target;
    if (type === "registered") {
      if (selectedTask) {
        dispatch(tasksActions.handleRemoveAssignee(selectedTask, value))
      } else if (selectedTasks) {
        for (const task of selectedTasks) {
          dispatch(tasksActions.handleRemoveAssignee(task, value))
        }
      }
    } else if (type === "anonymous") {
      if (selectedTask) {
        dispatch(tasksActions.handleRemoveAnonymousAssignee(selectedTask, value))
      } else if (selectedTasks) {
        for (const task of selectedTasks) {
          dispatch(tasksActions.handleRemoveAnonymousAssignee(task, value))
        }
      }
    } else if (type === "invited") {
      if (selectedTask) {
        dispatch(tasksActions.handleRemoveInvitedAssignee(selectedTask, value))
      } else if (selectedTasks) {
        for (const task of selectedTasks) {
          dispatch(tasksActions.handleRemoveInvitedAssignee(task, value))
        }
      }
    }
  }

  const getAssigneesValue = (users, assignees, anonymousAssignees, invitedAssignees) => {
    return [
      ...assignees.map((assignee) => ({
        username: assignee,
        firstName: users[assignee].firstName,
        lastName: users[assignee].lastName,
        initials: users[assignee].initials,
        avatar: users[assignee].avatar,
      })),
      ...anonymousAssignees.map((assignee) => ({
        name: assignee,
        initials: assignee[0],
      })),
      ...invitedAssignees.map((assignee) => ({
        email: assignee,
      })),
    ]
  };

  const assigneesValue = useMemo(() => getAssigneesValue(users, value.assignees, value.anonymousAssignees, value.invitedAssignees), [value, users]);

  return (
    <UsersField
      name={name}
      label={label}
      emptyMsg={emptyMsg}
      onAdd={() => showModal(modals.ASSIGNEE_CHOOSER)}
      onRemove={handleRemoveAssignee}
      value={assigneesValue}
      readOnly={readOnly}
    />
  )
}

export default AssigneeField;