import React, { useMemo } from 'react';
import { connect } from "react-redux";
import { AuthState } from "../../../constants";
import DateField from "../../UI/fields/DateField";
import * as tasksActions from "../../../actions/tasks";
import styled from "styled-components";
import TagField from "../../UI/fields/TagField";
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
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
      selectedTask
    },
    dispatch
  } = props;

  const getReadOnly = (user, projects, selectedProject) => {
    return user.state === AuthState.SignedIn &&
      projects[selectedProject]?.owner !== user.data.username &&
      projects[selectedProject]?.permissions === "r"
  }

  const readOnly = useMemo(() => getReadOnly(user, projects, selectedProject), [user, projects, selectedProject])
  
  const handleChange = (e) => {
    dispatch(
      tasksActions.handleUpdateTask({
        id: selectedTask,
        [e.target.name]: e.target.value,
      })
    );
  };
  return selectedTask && (
    <DetailsForm>
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
          value={tasks[selectedTask].task || ""}
          readOnly={readOnly}
        />
        <Textarea
          name="description"
          placeholder="description…"
          label="Description"
          onChange={handleChange}
          value={tasks[selectedTask].description || ""}
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
          value={tasks[selectedTask].tags || []}
          readOnly={readOnly}
        />
        <Select
          name="status"
          label="Status"
          onChange={handleChange}
          values={["todo", "pending", "done"]}
          options={["Todo", "Pending", "Done"]}
          colors={["#FFEBE5", "#FDF1DB", "#DAF6F4"]}
          value={tasks[selectedTask].status}
          readOnly={readOnly}
        />
      </form>
    </DetailsForm>
  )
}

const DetailsForm = styled(SimpleBar)`
  flex: 1;
  overflow: auto;
  height: 0;
  min-height: 0;
  & .simplebar-content > form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: 0 25px 25px 25px;
    & > h2 > span {
      cursor: pointer;
    }
    & > input[type="submit"] {
      display: none;
    }
  }
`;

export default connect((state) => ({
  user: state.user,
  projects: state.projects,
  tasks: state.tasks,
  app: state.app,
  comments: state.comments,
  users: state.users,
}))(Details);
