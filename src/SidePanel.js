import styledComponents from "styled-components";
import serialize from "form-serialize"

export const SidePanel = (props) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = serialize(e.target, { hash: true })
  };
  return (
    <Overlay>
      <Panel>
        <DetailsForm onSubmit={handleSubmit}>
          <h2>
            Note Details
          </h2>
          <label htmlFor="task">Task - Pull from task</label>
          <input type="text" name="task"></input>
          <label htmlFor="description">Description</label>
          <input type="text" name="description"></input>
          <label htmlFor="steps">
            Steps - These are sub tasks only seen here
          </label>
          <input type="text" name="steps"></input>
          <label htmlFor="due">Due date field</label>
          <input type="date" name="due"></input>
          <label htmlFor="assigned">Assigned a username from IAM</label>
          <input type="text" name="assigned"></input>
          <label htmlFor="watcher">Watcher - A username from IAM</label>
          <input type="text" name="watcher"></input>
          <label htmlFor="project">Project - Name of project</label>
          <input type="text" name="project"></input>
          <label htmlFor="tag">Tag - Multiple tags</label>
          <input type="text" name="tag"></input>
          <label htmlFor="sprint">Sprint - A text field</label>
          <input type="text" name="sprint"></input>
          <label htmlFor="status">Status</label>
          <input type="text" name="status"></input>
          <label htmlFor="comment">Comment</label>
          <input type="text" name="comment"></input>
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
    background-color: #000000;
    color: #FFFFFF;
    width: fit-content;
    height: fit-content;
    margin-top: 10px;
    border: none;
    border-radius: 5px;
    padding: 8px;
    align-self: flex-end;
  }
`;
