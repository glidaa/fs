import React, { useMemo } from 'react';
import { connect } from "react-redux";
import { AuthState } from "@aws-amplify/ui-components";
import { DatePicker } from "../../DatePicker";
import * as tasksActions from "../../../actions/tasks";
import styledComponents from "styled-components";
import StatusField from "../../StatusField";
import TagField from "../../TagField";
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import AssigneeField from "../../AssigneeField";

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
        <Detail>
          <label htmlFor="assignee">
            Assigned To
          </label>
          <AssigneeField
            name="assignees"
            value={tasks[selectedTask].assignees}
            readOnly={readOnly}
          />
        </Detail>
        <Detail>
          <label htmlFor="task">
            Task
          </label>
          <input
            type="text"
            name="task"
            placeholder="task…"
            onChange={handleChange}
            value={tasks[selectedTask].task || ""}
            contentEditable={false}
            readOnly={readOnly}
          ></input>
        </Detail>
        <Detail>
          <label htmlFor="description">
            Description
          </label>
          <input
            type="text"
            name="description"
            placeholder="description…"
            onChange={handleChange}
            value={tasks[selectedTask].description || ""}
            contentEditable={false}
            readOnly={readOnly}
          ></input>
        </Detail>
        <Detail>
          <label htmlFor="due">
            Due
          </label>
          <DatePicker
            name="due"
            onChange={handleChange}
            placeholder="No date choosen"
            value={tasks[selectedTask].due}
            readOnly={readOnly}
          />
        </Detail>
        <Detail>
          <label htmlFor="tag">
            Tags
          </label>
          <TagField
            onChange={handleChange}
            value={tasks[selectedTask].tags || []}
            readOnly={readOnly}
          />
        </Detail>
        <Detail>
          <label htmlFor="status">
            Status
          </label>
          <StatusField
            onChange={handleChange}
            value={tasks[selectedTask].status}
            readOnly={readOnly}
          />
        </Detail>
        <input type="submit" name="submit" value="Submit"></input>
      </form>
    </DetailsForm>
  )
}

const DetailsForm = styledComponents(SimpleBar)`
  flex: 1;
  overflow: auto;
  height: 0;
  min-height: 0;
  & .simplebar-content > form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    & > h2 > span {
      cursor: pointer;
    }
    & > input[type="submit"] {
      display: none;
    }
  }
`;

const Detail = styledComponents.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: 0 25px;
  gap: 5px;
  & > label {
    color: #222222;
    margin-bottom: 0;
    width: max-content;
    font-size: 16px;
    font-weight: 600;
  }
  & > input {
    width: calc(100% - 20px);
    padding: 5px 10px;
    border: 1px solid #C0C0C0;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 400;
    &::placeholder {
      color: #C0C0C0;
    }
  }
`

export default connect((state) => ({
  user: state.user,
  projects: state.projects,
  tasks: state.tasks,
  app: state.app,
  comments: state.comments,
  users: state.users,
}))(Details);
