import styledComponents from "styled-components";
import { connect } from "react-redux";
import * as notesActions from "../actions/notes";
import * as notesEditorActions from "../actions/app";
import { AuthState } from "@aws-amplify/ui-components";
import copyIcon from "../assets/copy-outline.svg";
import duplicatecon from "../assets/duplicate-outline.svg";
import { Specials } from "./Specials";
import {
  suggestionsList,
  suggestionsDescription,
  NOT_ASSIGNED,
} from "../constants";
import copyNote from "../utils/copyNote";
import parseLinkedList from "../utils/parseLinkedList";

const TaskItem = (props) => {
  const {
    handler,
    users,
    item,
    user,
    notes,
    app,
    readOnly,
    dispatch,
    setHideShowSidePanel,
  } = props;
  const onChange = (e) => {
    dispatch(
      notesActions.handleUpdateNote({
        id: app.selectedNote,
        note: e.target.value,
      })
    );
  };
  const onKeyUp = (e) => {
    if (e.key === "Enter") {
      return dispatch(notesEditorActions.handleSetNote(null));
    }
  };
  const onChooseSuggestion = (suggestion) =>
    dispatch(
      notesActions.handleUpdateNote({
        id: app.selectedNote,
        note: notes[app.selectedNote] + suggestion,
      })
    );
  return (
    <TaskItemContainer>
      <div>
        {handler}
        {app.selectedNote === item.id ? (
          <div className="taskInputContainer">
            <input
              type="text"
              data-testid="updateTaskField"
              className="task"
              placeholder="Note…"
              value={notes[app.selectedNote].note + app.command}
              onKeyUp={onKeyUp}
              onChange={onChange}
              autoFocus={true}
              contentEditable={false}
              readOnly={readOnly}
            />
            {app.isDropdownOpened && (
              <Specials
                onChooseSuggestion={onChooseSuggestion}
                suggestionsList={suggestionsList}
                suggestionsCondition={[
                  user.state !== AuthState.SignedIn,
                  user.state !== AuthState.SignedIn,
                  true,
                  true,
                  true,
                  true,
                  user.state === AuthState.SignedIn,
                ]}
                suggestionsDescription={suggestionsDescription}
              />
            )}
          </div>
        ) : (
          <span
            className={item.note ? null : "placeholder"}
            onClick={() =>
              !readOnly && dispatch(notesEditorActions.handleSetNote(item.id))
            }
          >
            {item.isDone ? <strike>{item.note}</strike> : item.note || "Note…"}
          </span>
        )}
      </div>
      <div>
        {user.state === AuthState.SignedIn && (
          <span className="assigneeName">
            {item.assignee !== NOT_ASSIGNED && users[item.assignee]
              ? users[item.assignee]
              : "Not Assigned"}
          </span>
        )}
        {!readOnly && (
          <>
            <img
              alt="copy note"
              src={copyIcon}
              width="12"
              onClick={() => {
                window.localStorage.setItem(
                  "notesClipboard",
                  "COPIEDNOTESTART=>" + JSON.stringify(item) + "<=COPIEDNOTEEND"
                );
              }}
            />
            <img
              alt="duplicate note"
              src={duplicatecon}
              onClick={() => {
                dispatch(
                  notesActions.handleCreateNote(
                    copyNote(
                      item,
                      app.selectedProject,
                      parseLinkedList(
                        notes,
                        "prevNote",
                        "nextNote"
                      ).reverse()[0]?.id
                    )
                  )
                );
              }}
              width="12"
            />
            <span
              className="removeBtn"
              onClick={() => dispatch(notesActions.handleRemoveNote(item))}
            >
              ×
            </span>
            {app.selectedNote === item.id && (
              <span
                className="removeBtn"
                onClick={() => {
                  setHideShowSidePanel();
                }}
              >
                {">"}
              </span>
            )}
          </>
        )}
      </div>
    </TaskItemContainer>
  );
};

const TaskItemContainer = styledComponents.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 0.5px solid transparent;
  border-radius: 4px;
  padding: 4px 8px;
  transition: border 0.3s, box-shadow 0.3s, transform: 0.03s;
  .drag-icon {
    display: none;
    cursor: pointer;
  }
  div:hover  .drag-icon{
    display: block;
  } 
  & > div:nth-child(1) {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    & > span:nth-child(2) {
      cursor: text;
      &.placeholder {
        color: #D3D3D3;
      }
    }
    & > span:nth-child(2), & > div.taskInputContainer > input {
      font-size: 1em;
      min-width: 100%;
    }
    & > .nestable-item-handler {
      cursor: grab;
      &:active {
        cursor: grabbing;
      }
    }
  }
  & > div:nth-child(2) {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    & > span.removeBtn {
      display: none;
      cursor: pointer;
      font-weight: bold;
    }
    & > span.assigneeName {
      display: none;
      color: grey;
      font-style: italic;
      width: max-content;
      height: min-content;
      font-size: 12px;
    }
    & > img {
      display: none;
      cursor: pointer;
    }
  }
  &:focus {
    border: 0.5px solid #6F7782;
    box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
  }
  &:hover {
    border: 0.5px solid #9198a1;
    & > div:nth-child(2) {
      & > span.removeBtn,
      & > span.assigneeName,
      & > img {
        display: block;
      }
    }
  }
  @media only screen and (max-width: 768px) {
    .drag-icon {
      display: block;
      cursor: pointer;
    }
    & {
      margin: 10px 0;
      padding: 10px 7px;
      border: 0.5px solid #9198a1;
      & > div:nth-child(2) {
        & > span.removeBtn,
        & > span.assigneeName,
        & > img {
          display: block;
        }
      }
    }
  }
  & > div.taskInputContainer {
    height: 26px;
  }
`;
export default connect((state) => ({
  user: state.user,
  notes: state.notes,
  app: state.app,
  users: state.users,
}))(TaskItem);
