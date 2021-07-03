import { connect } from "react-redux";
import { DatePicker } from "./DatePicker";
import * as notesActions from "../actions/notes";
import { AuthState } from "@aws-amplify/ui-components";
import styledComponents from "styled-components";
import ShareBtn from "./ShareBtn";
import { Select } from "./Select";
import { Tag } from "./Tag";
import Comments from "./Comments";
import "draft-js/dist/Draft.css";
import AssigneeField from "./AssigneeField";
import useWindowSize from "../utils/useWindowSize";

const SidePanel = (props) => {
  const {
    user,
    notes,
    app,
    readOnly,
    dispatch,
    sidePanel,
    setHideShowSidePanel,
  } = props;
  let { width } = useWindowSize();
  const handleChange = (e) => {
    dispatch(
      notesActions.handleUpdateNote({
        id: app.selectedNote,
        [e.target.name]: e.target.value,
      })
    );
  };
  return (
    <Panel open={sidePanel} data-testid="sidePanel">
      {width <= 768 && (
        <Button onClick={() => setHideShowSidePanel()}>X</Button>
      )}
      {app.selectedNote && (
        <>
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
            {user.state === AuthState.SignedIn && (
              <div>
                <label htmlFor="assignee">Assignee</label>
                <AssigneeField
                  name="assignee"
                  value={notes[app.selectedNote].assignee}
                  readOnly={readOnly}
                />
              </div>
            )}
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
              <label htmlFor="steps">Steps</label>
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
                  finished: "Finished",
                }}
                value={notes[app.selectedNote].status}
                readOnly={readOnly}
              />
            </div>
            <input type="submit" name="submit" value="Submit"></input>
          </DetailsForm>
          {user.state === AuthState.SignedIn && <Comments />}
        </>
      )}
    </Panel>
  );
};

const Panel = styledComponents.div`
  background-color: #FFFFFF;
  height: 100vh;
  flex: 3;
  box-shadow: 0px 0px 8px 1px #dadada;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    text-align: left;
    position: absolute;
    top: 0;
    left: 0;
    transition: transform 0.3s ease-in-out;
    transform: ${({ open }) => (open ? "translateX(0)" : "translateX(-100%)")};
    z-index: 1;
    box-shadow: unset;
  }
`;

const DetailsForm = styledComponents.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  @media only screen and (max-width: 768px) {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow: unset;
    padding: unset;
    & > input {
      width: unset;
      padding: 0 20px;
    }
  }
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
  @media only screen and (max-width: 768px) {
    & > input {
    width: auto;
    margin: 0 20px;
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
 
  @media only screen and (max-width: 768px) {
    & > div {
      align-items: initial;
      width: auto;
      flex-direction: column;
      padding: 0 20px;
      gap: unset;
      & > label {
        color: #6F7782;
        margin-bottom: 0;
        font-size: 14px;
        width: auto;
        font-weight: 600;
      }
      & > input {
        border: 0.5px solid transparent;
        border-radius: 4px;
        padding: 14px 10px;
        font-size: 14px;
        transition: border 0.3s, box-shadow 0.3s;
        border: 0.5px solid #6F7782;
        margin-top: 5px;
        &:hover {
          border: 0.5px solid #9198a1;
        }
        &:focus {
          border: 0.5px solid #6F7782;
          box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
        }
      }
    }
  }
  & > input[type="submit"] {
    display: none;
  }
`;

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
  notes: state.notes,
  app: state.app,
  comments: state.comments,
  users: state.users,
}))(SidePanel);
