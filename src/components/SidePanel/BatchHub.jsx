import React, { useMemo, forwardRef, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AuthState } from "../../constants";
import DateField from "../UI/fields/DateField";
import * as appActions from "../../actions/app";
import * as tasksActions from "../../actions/tasks";
import styles from "./BatchHub.module.scss";
import TagField from "../UI/fields/TagField";
import AssigneeField from "../UI/fields/AssigneeField";
import WatcherField from '../UI/fields/WatcherField';
import ComboBox from '../UI/fields/ComboBox';
import { useReadOnly } from '../ReadOnlyListener';

const TaskHub = forwardRef((_, ref) => {
  const dispatch = useDispatch();
  const readOnly = useReadOnly();

  const userState = useSelector(state => state.user.state);

  const tasks = useSelector(state => state.tasks);

  const selectedProject = useSelector(state => state.projects[state.app.selectedProject]);

  const selectedTasksIds = useSelector(state => state.app.selectedTasks);

  const closePanel = () => {
    return dispatch(appActions.handleSetRightPanel(false))
  }
  
  const handleChange = (e) => {
    for (const taskId of selectedTasksIds) {
      dispatch(
        tasksActions.handleUpdateTask({
          id: taskId,
          action: "update",
          field: e.target.name,
          value: e.target.value
        })
      );
    }
  };
  const getCommonProps = (tasks, selectedTasks) => {
    const commonProps = {
      assignees: [],
      anonymousAssignees: [],
      invitedAssignees: [],
      watchers: [],
      tags: [],
      due: undefined,
      status: undefined,
      priority: undefined,
    };
    const arrayProps = [
      "assignees",
      "anonymousAssignees",
      "invitedAssignees",
      "watchers",
      "tags",
    ];
    const stringProps = [
      "status",
      "priority",
      "due",
    ];
    let first = true;
    if (selectedTasks) {
      for (const selectedTask of selectedTasks) {
        if (first ^ (first = false)) {
          for (const key of arrayProps) {
            commonProps[key] = tasks[selectedTask][key];
          }
          for (const key of stringProps) {
            commonProps[key] = tasks[selectedTask][key];
          }
        } else {
          for (const key of arrayProps) {
            commonProps[key] = [
              ...new Set([
                ...commonProps[key],
                ...tasks[selectedTask][key],
              ]),
            ].filter(
              (x) =>
                commonProps[key].includes(x) &&
                tasks[selectedTask][key].includes(x)
            );
          }
          for (const key of stringProps) {
            if (commonProps[key] !== tasks[selectedTask][key]) {
              commonProps[key] = undefined;
            }
          }
        }
      }
    }
    return commonProps;
  };

  const commonProps = useMemo(() => getCommonProps(tasks, selectedTasksIds), [tasks, selectedTasksIds]);

  useImperativeHandle(ref, () => ({
    panelProps: {
      title: `${selectedTasksIds.length} Task${
        selectedTasksIds.length > 1 ? "s" : ""
      } Selected`,
      onClose: () => {
        closePanel()
      },
    },
  }));
  return selectedTasksIds && (
    <form onSubmit={(e) => e.preventDefault()} className={styles.DetailsForm}>
      <input type="submit" name="submit" value="Submit"></input>
      <AssigneeField
        name="assignees"
        label="Assigned To"
        emptyMsg="No Common Assignees Found"
        value={{
          assignees: commonProps.assignees,
          anonymousAssignees: commonProps.anonymousAssignees,
          invitedAssignees: commonProps.invitedAssignees
        }}
        readOnly={readOnly}
      />
      {(userState === AuthState.SignedIn || (userState !== AuthState.SignedIn && selectedProject?.isTemp)) && (
        <WatcherField
          name="watchers"
          label="Watched By"
          emptyMsg="No Common Watchers Found"
          value={commonProps.watchers}
          readOnly={readOnly}
        />
      )}
      <DateField
        name="due"
        label={
          commonProps.due === undefined
            ? "Due Date (conflict)"
            : "Due Date"
        }
        onChange={handleChange}
        placeholder="no date selected"
        value={commonProps.due}
        readOnly={readOnly}
        clearable
      />
      <TagField
        name="tags"
        label="Tags"
        onChange={handleChange}
        placeholder="tag…"
        value={commonProps.tags}
        readOnly={readOnly}
      />
      <ComboBox
        name="status"
        label={
          commonProps.status === undefined
            ? "Status (conflict)"
            : "Status"
        }
        onChange={handleChange}
        value={commonProps.status}
        options={selectedProject.statusSet.map(({ id, title }) => [id, title])}
        readOnly={readOnly}
      />
      <ComboBox
        name="priority"
        label={
          commonProps.priority === undefined
            ? "Priority (conflict)"
            : "Priority"
        }
        onChange={handleChange}
        value={commonProps.priority}
        options={[
          ["low", "Low"],
          ["normal", "Normal"],
          ["high", "High"],
        ]}
        readOnly={readOnly}
      />
    </form>
  )
});

TaskHub.displayName = "TaskHub";

export default TaskHub;
