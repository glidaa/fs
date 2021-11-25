import React, { useMemo } from 'react';
import { connect } from "react-redux";
import { AuthState } from "../../../constants";
import DateField from "../../UI/fields/DateField";
import * as tasksActions from "../../../actions/tasks";
import styles from "./Details.module.scss";
import TagField from "../../UI/fields/TagField";
import SimpleBar from 'simplebar-react';
import AssigneeField from "../../UI/fields/AssigneeField";
import Textarea from '../../UI/fields/Textarea';
import WatcherField from '../../UI/fields/WatcherField';
import TextField from '../../UI/fields/TextField';
import Select from '../../UI/fields/Select';

const Details = (props) => {
  const {
    tasks,
    projects,
    user,
    app: {
      selectedProject,
      selectedTask,
      isSynced
    },
    dispatch
  } = props;

  const getReadOnly = (user, projects, selectedProject, isSynced) => {
    return user.state === AuthState.SignedIn &&
    ((projects[selectedProject]?.owner !== user.data.username &&
    projects[selectedProject]?.permissions === "r") || !isSynced)
  }

  const readOnly = useMemo(() => getReadOnly(user, projects, selectedProject, isSynced), [user, projects, selectedProject, isSynced])
  
  const handleChange = (e) => {
    dispatch(
      tasksActions.handleUpdateTask({
        id: selectedTask,
        [e.target.name]: e.target.value,
      })
    );
  };
  return selectedTask && (
    <SimpleBar className={styles.DetailsForm}>
      <form onSubmit={(e) => e.preventDefault()}>
        <input type="submit" name="submit" value="Submit"></input>
        <AssigneeField
          name="assignees"
          label="Assigned To"
          value={tasks[selectedTask].assignees}
          readOnly={readOnly}
        />
        {user.state === AuthState.SignedIn && (
          <WatcherField
            name="watchers"
            label="Watched By"
            value={tasks[selectedTask].watchers}
            readOnly={readOnly}
          />
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
        <Select
          name="status"
          label="Status"
          onChange={handleChange}
          values={["todo", "pending", "done"]}
          options={["Todo", "Pending", "Done"]}
          value={tasks[selectedTask].status}
          readOnly={readOnly}
        />
        <Select
          name="priority"
          label="Priority"
          onChange={handleChange}
          values={["low", "normal", "high"]}
          options={["Low", "Normal", "High"]}
          value={tasks[selectedTask].priority}
          readOnly={readOnly}
        />
      </form>
    </SimpleBar>
  )
}

export default connect((state) => ({
  user: state.user,
  projects: state.projects,
  tasks: state.tasks,
  app: state.app,
  comments: state.comments,
  users: state.users,
}))(Details);
