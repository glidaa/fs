import { useReducer } from "react"
import styledComponents from "styled-components";

export const SidePanel = (props) => {
  const [_, forceUpdate] = useReducer(x => x + 1, 0);
  const handleChange = (e) => {
    props.higherScope.currentNoteState[e.target.name] = e.target.value
    forceUpdate();
  }
  return (
    <Overlay data-testid="sidePanel">
      <Panel>
        <DetailsForm>
          <h2>Note Details</h2>
          <label htmlFor="task">Task - Pull from task</label>
          <input
            type="text"
            name="task"
            onChange={handleChange}
            value={
              props.higherScope.currentNoteState.task
                ? props.higherScope.currentNoteState.task
                : ""
            }
          ></input>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            onChange={handleChange}
            value={
              props.higherScope.currentNoteState.description
                ? props.higherScope.currentNoteState.description
                : ""
            }
          ></input>
          <label htmlFor="steps">
            Steps - These are sub tasks only seen here
          </label>
          <input
            type="text"
            name="steps"
            onChange={handleChange}
            value={
              props.higherScope.currentNoteState.steps
                ? props.higherScope.currentNoteState.steps
                : ""
            }
          ></input>
          <label htmlFor="due">Due date field</label>
          <input
            type="date"
            name="due"
            onChange={handleChange}
            value={
              props.higherScope.currentNoteState.due
                ? props.higherScope.currentNoteState.due
                : ""
            }
          ></input>
          <label htmlFor="assigned">Assigned a username from IAM</label>
          <input
            type="text"
            name="assigned"
            onChange={handleChange}
            value={
              props.higherScope.currentNoteState.assigned
                ? props.higherScope.currentNoteState.assigned
                : ""
            }
          ></input>
          <label htmlFor="watcher">Watcher - A username from IAM</label>
          <input
            type="text"
            name="watcher"
            onChange={handleChange}
            value={
              props.higherScope.currentNoteState.watcher
                ? props.higherScope.currentNoteState.watcher
                : ""
            }
          ></input>
          <label htmlFor="project">Project - Name of project</label>
          <input
            type="text"
            name="project"
            onChange={handleChange}
            value={
              props.higherScope.currentNoteState.project
                ? props.higherScope.currentNoteState.project
                : ""
            }
          ></input>
          <label htmlFor="tag">Tag - Multiple tags</label>
          <input
            type="text"
            name="tag"
            onChange={handleChange}
            value={
              props.higherScope.currentNoteState.tag
                ? props.higherScope.currentNoteState.tag
                : ""
            }
          ></input>
          <label htmlFor="sprint">Sprint - A text field</label>
          <input
            type="text"
            name="sprint"
            onChange={handleChange}
            value={
              props.higherScope.currentNoteState.sprint
                ? props.higherScope.currentNoteState.sprint
                : ""
            }
          ></input>
          <label htmlFor="status">Status</label>
          <input
            type="text"
            name="status"
            onChange={handleChange}
            value={
              props.higherScope.currentNoteState.status
                ? props.higherScope.currentNoteState.status
                : ""
            }
          ></input>
          <label htmlFor="comment">Comment</label>
          <input
            type="text"
            name="comment"
            onChange={handleChange}
            value={
              props.higherScope.currentNoteState.comment
                ? props.higherScope.currentNoteState.comment
                : ""
            }
          ></input>
          <input type="submit" name="submit" value="Submit"></input>
        </DetailsForm>
      </Panel>
    </Overlay>
  );  
}

const Overlay = styledComponents.div`
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 9999;
  background-color: #000000DD;
`;

const Panel = styledComponents.div`
  background-color: #FFFFFF;
  min-height: 100vh;
  top: 0;
  left: 0;
`;

const DetailsForm = styledComponents.form`
  display: flex;
  flex-direction: column;
  height: calc(100vh);
  overflow: auto;
  padding: 30px;
  & > label {
    font-weight: bold;
    margin-top: 10px;
  }
  & > h2 > span {
    cursor: pointer;
  }
  & > input[type="submit"] {
    display: none;
  }
`;
