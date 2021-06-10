
import { connect } from "react-redux";
import { DatePicker } from './DatePicker';
import * as notesActions from "../actions/notes";
import { AuthState } from '@aws-amplify/ui-components';
import styledComponents from "styled-components";
import ShareBtn from "./ShareBtn"
import { Select } from "./Select"
import { Tag } from "./Tag"
import Comments from "./Comments"
import 'draft-js/dist/Draft.css';
import AssigneeField from "./AssigneeField";

const SidePanel = (props) => {
  const { user, notes, app, readOnly, dispatch } = props
  const handleChange = (e) => {
    dispatch(notesActions.handleUpdateNote({ 
        id: app.selectedNote,
        [e.target.name]: e.target.value 
    }))
  }
  return (
    <Panel data-testid="sidePanel">
      {app.selectedNote && <>
        <DetailsForm onSubmit={(e) => e.preventDefault()}>
          <ShareBtn isNote={true} />
          <input
            type="text"
            name="note"
            placeholder="Note…"
            onChange={handleChange}
            value={notes[app.selectedNote].note || ""}
            contentEditable={false}
            readOnly={readOnly}
          ></input>
          {user.state === AuthState.SignedIn && <div>
          <label htmlFor="assignee">Assignee</label>
          <AssigneeField
            name="assignee"
            value={notes[app.selectedNote].assignee}
            readOnly={readOnly}
          />
          </div>}
          <div>
          <label htmlFor="task">Task</label>
          <input
            type="text"
            name="task"
            placeholder="task"
            onChange={handleChange}
            value={notes[app.selectedNote].task || ""}
            contentEditable={false}
            readOnly={readOnly}
          ></input>
          </div>
          <div>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            placeholder="description"
            onChange={handleChange}
            value={notes[app.selectedNote].description || ""}
            contentEditable={false}
            readOnly={readOnly}
          ></input>
          </div>
          <div>
          <label htmlFor="steps">
            Steps
          </label>
          <input
            type="text"
            name="steps"
            placeholder="steps"
            onChange={handleChange}
            value={notes[app.selectedNote].steps || ""}
            contentEditable={false}
            readOnly={readOnly}
          ></input>
          </div>
          <div>
          <label htmlFor="due">Due</label>
          <DatePicker
            name="due"
            onChange={handleChange}
            placeholder="due"
            value={notes[app.selectedNote].due}
            readOnly={readOnly}
          />
          </div>
          <div>
          <label htmlFor="watcher">Watcher</label>
          <input
            type="text"
            name="watcher"
            placeholder="watcher"
            onChange={handleChange}
            value={notes[app.selectedNote].watcher || ""}
            contentEditable={false}
            readOnly={readOnly}
          ></input>
          </div>
          <div>
          <label htmlFor="tag">Tag</label>
          <Tag
            name="tag"
            onChange={handleChange}
            value={notes[app.selectedNote].tag || []}
            readOnly={readOnly}
          />
          </div>
          <div>
          <label htmlFor="sprint">Sprint</label>
          <input
            type="text"
            name="sprint"
            placeholder="sprint"
            onChange={handleChange}
            value={notes[app.selectedNote].sprint || ""}
            contentEditable={false}
            readOnly={readOnly}
          ></input>
          </div>
          <div>
          <label htmlFor="status">Status</label>
          <Select
            name="status"
            onChange={handleChange}
            defaultValue="todo"
            options={{
              todo: "Todo",
              started: "Started",
              finished: "Finished"
            }}
            value={notes[app.selectedNote].status}
            readOnly={readOnly}
          />
          </div>
          <input type="submit" name="submit" value="Submit"></input>
        </DetailsForm>
        {user.state === AuthState.SignedIn && <Comments />}
      </>}
    </Panel>
  );  
}

const Panel = styledComponents.div`
  background-color: #FFFFFF;
  height: 100vh;
  flex: 3;
  box-shadow: 0px 0px 8px 1px #dadada;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
`;

const DetailsForm = styledComponents.form`
  display: flex;
  flex: 3;
  flex-direction: column;
  gap: 16px;
  max-height: calc(100vh - 60px);
  overflow: auto;
  padding: 30px;
  .ant-picker {
    font-size: 12px;
    width: 120px;
    border: 1px solid transparent;
    border-radius: 4px;
    &:focus, &:hover {
      border: 1px solid #d9d9d9;
    }
  }
  & > h2 > span {
    cursor: pointer;
  }
  & > input {
    border: 0.5px solid transparent;
    border-radius: 4px;
    padding: 4px 8px;
    width: calc(100% - 16px);
    font-weight: 600;
    font-size: 24px;
    margin-left: -8px;
    transition: border 0.3s, box-shadow 0.3s;
    &:hover {
      border: 0.5px solid #9198a1;
    }
    &:focus {
      border: 0.5px solid #6F7782;
      box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
    }
  }
  & > div {
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    gap: 20px;
    & > label {
      color: #6F7782;
      margin-bottom: 0;
      width: 150px;
      font-size: 12px;
    }
    & > input {
      border: 0.5px solid transparent;
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 12px;
      transition: border 0.3s, box-shadow 0.3s;
      &:hover {
        border: 0.5px solid #9198a1;
      }
      &:focus {
        border: 0.5px solid #6F7782;
        box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
      }
    }
  }
  & > input[type="submit"] {
    display: none;
  }
`;

export default connect((state) => ({
  user: state.user,
  notes: state.notes,
  app: state.app,
  comments: state.comments,
  users: state.users,
}))(SidePanel);