import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AuthState, ThingStatus } from "../../../constants";
import DateField from "../../UI/fields/DateField";
import * as tasksActions from "../../../actions/tasks";
import styles from "./Details.module.scss";
import TagField from "../../UI/fields/TagField";
import AssigneeField from "../../UI/fields/AssigneeField";
import Textarea from '../../UI/fields/Textarea';
import WatcherField from '../../UI/fields/WatcherField';
import TextField from '../../UI/fields/TextField';
import AttachmentField from '../../UI/fields/AttachmentField';
import ComboBox from '../../UI/fields/ComboBox';
import { useReadOnly } from '../../ReadOnlyListener';

const Details = () => {
  const dispatch = useDispatch();
  const readOnly = useReadOnly();

  const userState = useSelector(state => state.user.state);

  const selectedProject = useSelector(state => state.projects[state.app.selectedProject]);

  const tasks = useSelector(state => state.tasks);

  const attachments = useSelector(state => state.attachments);

  const selectedTask = useSelector(state => state.app.selectedTask);
  const isAttachmentsReady = useSelector(state => state.status.attachments === ThingStatus.READY);
  
  const handleChange = (e) => {
    dispatch(
      tasksActions.handleUpdateTask({
        id: selectedTask,
        action: "update",
        field: e.target.name,
        value: e.target.value
      })
    );
  };
  return selectedTask && (
    <form onSubmit={(e) => e.preventDefault()} className={styles.DetailsForm}>
      <input type="submit" name="submit" value="Submit"></input>
      <AssigneeField
        name="assignees"
        label="Assigned To"
        value={{
          assignees: tasks[selectedTask].assignees,
          anonymousAssignees: tasks[selectedTask].anonymousAssignees,
          invitedAssignees: tasks[selectedTask].invitedAssignees
        }}
        readOnly={readOnly}
      />
      {(userState === AuthState.SignedIn || (userState !== AuthState.SignedIn && selectedProject?.isTemp)) && (
        <>
          <WatcherField
            name="watchers"
            label="Watched By"
            value={tasks[selectedTask].watchers}
            readOnly={readOnly}
          />
          <AttachmentField
            name="attachments"
            label="Attachments"
            value={attachments}
            loading={!isAttachmentsReady}
            readOnly={readOnly}
          />
        </>
      )}
      <TextField
        type="text"
        name="task"
        label="Task"
        placeholder="task…"
        onChange={handleChange}
        value={tasks[selectedTask].task}
        readOnly={readOnly}
      />
      <Textarea
        name="description"
        placeholder="description…"
        label="Description"
        onChange={handleChange}
        value={tasks[selectedTask].description}
        readOnly={readOnly}
      />
      <DateField
        name="due"
        label="Due"
        onChange={handleChange}
        placeholder="no date selected"
        value={tasks[selectedTask].due}
        readOnly={readOnly}
        clearable
      />
      <TagField
        name="tags"
        label="Tags"
        onChange={handleChange}
        placeholder="tag…"
        value={tasks[selectedTask].tags}
        readOnly={readOnly}
      />
      <ComboBox
        name="status"
        label="Status"
        onChange={handleChange}
        value={tasks[selectedTask].status}
        options={selectedProject.statusSet.map(({ id, title }) => [id, title])}
        readOnly={readOnly}
      />
      <ComboBox
        name="priority"
        label="Priority"
        onChange={handleChange}
        value={tasks[selectedTask].priority}
        options={[
          ["low", "Low"],
          ["normal", "Normal"],
          ["high", "High"],
        ]}
        readOnly={readOnly}
      />
    </form>
  )
}

export default Details;
