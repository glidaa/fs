import React from 'react';
import { connect } from "react-redux";
import { DatePicker } from "./DatePicker";
import * as appActions from "../actions/app";
import * as tasksActions from "../actions/tasks";
import { AuthState } from "@aws-amplify/ui-components";
import styledComponents from "styled-components";
import StatusField from "./StatusField";
import TagField from "./TagField";
import Comments from "./Comments";
import "draft-js/dist/Draft.css";
import AssigneeField from "./AssigneeField";
import useWindowSize from "../utils/useWindowSize";
import { ReactComponent as BackArrowIcon } from "../assets/chevron-back-outline.svg";
import { ReactComponent as ShareIcon } from "../assets/share-outline.svg"

const DetailsPanel = (props) => {
  const {
    user,
    tasks,
    app: {
      selectedTask,
      isDetailsPanelOpened
    },
    readOnly,
    dispatch
  } = props;
  
  const handleChange = (e) => {
    dispatch(
      tasksActions.handleUpdateTask({
        id: selectedTask,
        [e.target.name]: e.target.value,
      })
    );
  };
  const closePanel = () => {
    return dispatch(appActions.handleSetDetailsPanel(false))
  }
	const shareTask = () => {
		const linkToBeCopied = window.location.href
		navigator.clipboard.writeText(linkToBeCopied)
	}
  return (
    <DetailsPanelShell open={isDetailsPanelOpened}>
      <DetailsPanelToolbar>
        <DetailsPanelToolbarAction onClick={closePanel}>
          <BackArrowIcon
              width="24"
              height="24"
              strokeWidth="32"
              color="#006EFF"
          />
        </DetailsPanelToolbarAction>
        <DetailsPanelTitle>Task Details</DetailsPanelTitle>
        <DetailsPanelToolbarAction onClick={shareTask}>
          <ShareIcon
              width="24"
              height="24"
              strokeWidth="32"
              color="#006EFF"
          />
        </DetailsPanelToolbarAction>
      </DetailsPanelToolbar>
      {selectedTask && (
        <>
          <DetailsForm onSubmit={(e) => e.preventDefault()}>
            <Detail>
              <label htmlFor="assignee">Assignee</label>
              <AssigneeField
                name="assignee"
                value={tasks[selectedTask].assignee}
                readOnly={readOnly}
              />
            </Detail>
            <Detail>
              <label htmlFor="task">Task</label>
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
              <label htmlFor="description">Description</label>
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
              <label htmlFor="steps">Steps</label>
              <input
                type="text"
                name="steps"
                placeholder="steps…"
                onChange={handleChange}
                value={tasks[selectedTask].steps || ""}
                contentEditable={false}
                readOnly={readOnly}
              ></input>
            </Detail>
            <Detail>
              <label htmlFor="due">Due</label>
              <DatePicker
                name="due"
                onChange={handleChange}
                placeholder="No date choosen"
                value={tasks[selectedTask].due}
                readOnly={readOnly}
              />
            </Detail>
            <Detail>
              <label htmlFor="tag">Tags</label>
              <TagField
                onChange={handleChange}
                value={tasks[selectedTask].tags || []}
                readOnly={readOnly}
              />
            </Detail>
            <Detail>
              <label htmlFor="status">Status</label>
              <StatusField
                onChange={handleChange}
                value={tasks[selectedTask].status}
                readOnly={readOnly}
              />
            </Detail>
            <input type="submit" name="submit" value="Submit"></input>
          </DetailsForm>
          {user.state === AuthState.SignedIn && <Comments />}
        </>
      )}
    </DetailsPanelShell>
  );
};

const DetailsPanelShell = styledComponents.div`
  display: flex;
  background-color: #FFFFFF;
  flex-direction: column;
  height: 100vh;
  border-radius: 35px 0 0 35px;
  gap: 25px;
  flex: 1;
  transition: all 0.2s ease;
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(100%)")};
  max-width: ${({ open }) => (open ? "100vw" : "0px")};
  overflow: ${({ open }) => (open ? "auto" : "hidden")};
  @media only screen and (max-width: 768px) {
    position: fixed;
    width: 100vw;
    max-width: 100vw;
  }
  z-index: 1;
`;

const DetailsForm = styledComponents.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow: auto;
  & > h2 > span {
    cursor: pointer;
  }
  & > input {
    border: 0.5px solid transparent;
    border-radius: 4px;
    padding: 4px 8px;
    width: 100%;
    font-weight: 600;
    font-size: 24px;
    transition: border 0.3s, box-shadow 0.3s;
    &:hover {
      border: 0.5px solid #9198a1;
    }
    &:focus {
      border: 0.5px solid #6F7782;
      box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
    }
  }
  & > input[type="submit"] {
    display: none;
  }
`;

const Detail = styledComponents.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: 0 35px;
  gap: 10px;
  & > label {
    color: #222222;
    margin-bottom: 0;
    width: max-content;
    font-size: 1.2em;
    font-weight: 600;
  }
  & > input {
    border: 0.5px solid transparent;
    border-radius: 4px;
    font-size: 0.9em;
    font-weight: 500;
    &::placeholder {
      color: #C0C0C0;
    }
  }
`

const DetailsPanelToolbar = styledComponents.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 35px;
  padding-top: 25px;
`

const DetailsPanelTitle = styledComponents.span`
  color: #000000;
  font-size: 1.5em;
  font-weight: 600;
`

const DetailsPanelToolbarAction = styledComponents.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  background-color: transparent;
  cursor: pointer;
`

const Button = styledComponents.button`
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 600;
  position: absolute;
  top: 4%;
  right: 15px;
`;

export default connect((state) => ({
  user: state.user,
  tasks: state.tasks,
  app: state.app,
  comments: state.comments,
  users: state.users,
}))(DetailsPanel);
