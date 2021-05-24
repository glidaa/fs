import styledComponents from "styled-components"
import { AuthState } from '@aws-amplify/ui-components';
import { Specials } from "./Specials"
import {
  suggestionsList,
  suggestionsDescription
} from "../constants";

export const TaskItem = (props) => {
  return (
    <TaskItemContainer>
       <div>
       {props.handler}
        {props.higherScope.state.selectedNote === props.item.id ? (
          <div className="taskInputContainer">
            <input
              type="text"
              data-testid="updateTaskField"
              className="task"
              placeholder="Note…"
              value={props.higherScope.state.value}
              onKeyUp={e => e.key === "Enter" && props.higherScope.unSelectNote()}
              onChange={props.higherScope.handleChange}
              autoFocus={true}
            />
            {props.higherScope.state.isDropdownOpened && <Specials
              onChooseSuggestion={props.higherScope.chooseSugestion.bind(props.higherScope)}
              suggestionsList={suggestionsList}
              suggestionsCondition={[
                props.higherScope.authState !== AuthState.SignedIn,
                props.higherScope.authState !== AuthState.SignedIn,
                true,
                props.higherScope.authState === AuthState.SignedIn
              ]}
              suggestionsDescription={suggestionsDescription}
            />}
            </div>
      ) : <span
            className={props.item.note ? null : "placeholder"}
            onClick={props.higherScope.selectNote.bind(props.higherScope, props.item)}>
              {props.item.isDone ? <strike>{props.item.note}</strike> : props.item.note || "Note…"}
          </span>
        }</div>
            <span
              className="removeBtn"
              onClick={props.higherScope.handleDelete.bind(props.higherScope, props.item.id)}
            >
              ×
            </span>
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
  transition: border 0.3s, box-shadow 0.3s;
  &:focus {
    border: 0.5px solid #6F7782;
    box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
  }
  & > span.removeBtn {
    display: none;
    cursor: pointer;
    font-weight: bold;
  }
  &:hover {
    border: 0.5px solid #9198a1;
    & > span.removeBtn {
      display: block;
    }
  }
  & > div:nth-child(1) {
    width: calc(100% - 60px);
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
  & > div.taskInputContainer {
    height: 26px;
  }
`
