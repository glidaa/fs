import React, { useRef, useEffect } from 'react';
import { connect } from "react-redux";
import { DatePicker } from "../DatePicker";
import * as appActions from "../../actions/app";
import * as tasksActions from "../../actions/tasks";
import { AuthState } from "@aws-amplify/ui-components";
import styledComponents from "styled-components";
import StatusField from "../StatusField";
import TagField from "../TagField";
import Comments from "../Comments";
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import AssigneeField from "../AssigneeField";
import { ReactComponent as BackArrowIcon } from "../../assets/chevron-back-outline.svg";
import { ReactComponent as ShareIcon } from "../../assets/share-outline.svg"
import { ReactComponent as AssignIcon } from "../../assets/emoji_u1f4cc.svg"
import { ReactComponent as CalenderIcon } from "../../assets/emoji_u1f4c6.svg"
import { ReactComponent as TagIcon } from "../../assets/emoji_u1f3f7.svg"
import { ReactComponent as TaskIcon } from "../../assets/emoji_u1f4dd.svg"
import { ReactComponent as DescriptionIcon } from "../../assets/emoji_u1f4c3.svg"
import { ReactComponent as StatusIcon } from "../../assets/emoji_u1f6a6.svg"

const Details = (props) => {
  const {
    user,
    tasks,
    app: {
      selectedTask,
      lockedTaskField
    },
    readOnly,
    dispatch
  } = props;

  const idleTrigger = useRef(null)
	
	const forceIdle = () => {
		if (["task", "description"].includes(lockedTaskField)) {
			dispatch(appActions.setLockedTaskField(null))
		}
		clearTimeout(idleTrigger.current)
	}

	useEffect(() => () => forceIdle(), [])
  
  const handleChange = (e) => {
    if (["task", "description"].includes(e.target.name)) {
      if (lockedTaskField !== e.target.name) {
        dispatch(appActions.setLockedTaskField(e.target.name))
      }
      clearTimeout(idleTrigger.current)
      idleTrigger.current = setTimeout(() => {
        if (lockedTaskField === e.target.name) {
          dispatch(appActions.setLockedTaskField(null))
        }
      }, 5000);
    }
    dispatch(
      tasksActions.handleUpdateTask({
        id: selectedTask,
        [e.target.name]: e.target.value,
      })
    );
  };
  const closePanel = () => {
    forceIdle()
    return dispatch(appActions.handleSetRightPanel(false))
  }
	const shareTask = () => {
		const linkToBeCopied = window.location.href
		navigator.clipboard.writeText(linkToBeCopied)
	}
  return (
    <>
      <PanelPageToolbar>
        <PanelPageToolbarAction onClick={closePanel}>
          <BackArrowIcon
              width={24}
              height={24}
              strokeWidth={32}
              color="#006EFF"
          />
        </PanelPageToolbarAction>
        <PanelPageTitle>Task Details</PanelPageTitle>
        <PanelPageToolbarAction onClick={shareTask}>
          <ShareIcon
              width={24}
              height={24}
              strokeWidth={32}
              color="#006EFF"
          />
        </PanelPageToolbarAction>
      </PanelPageToolbar>
      {selectedTask && (
        <>
          <DetailsForm>
            <form onSubmit={(e) => e.preventDefault()}>
              <Detail>
                <label htmlFor="assignee">
                  <AssignIcon width={18} />
                  <span>Assigned To</span>
                </label>
                <AssigneeField
                  name="assignees"
                  value={tasks[selectedTask].assignees}
                  readOnly={readOnly}
                />
              </Detail>
              <Detail>
                <label htmlFor="task">
                  <TaskIcon width={18} />
                  <span>Task</span>
                </label>
                <input
                  type="text"
                  name="task"
                  placeholder="task…"
                  onChange={handleChange}
                  onBlur={forceIdle}
                  value={tasks[selectedTask].task || ""}
                  contentEditable={false}
                  readOnly={readOnly}
                ></input>
              </Detail>
              <Detail>
                <label htmlFor="description">
                  <DescriptionIcon width={18} />
                  <span>Description</span>
                </label>
                <input
                  type="text"
                  name="description"
                  placeholder="description…"
                  onChange={handleChange}
                  onBlur={forceIdle}
                  value={tasks[selectedTask].description || ""}
                  contentEditable={false}
                  readOnly={readOnly}
                ></input>
              </Detail>
              <Detail>
                <label htmlFor="due">
                  <CalenderIcon width={18} />
                  <span>Due</span>
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
                  <TagIcon width={18} />
                  <span>Tags</span>
                </label>
                <TagField
                  onChange={handleChange}
                  value={tasks[selectedTask].tags || []}
                  readOnly={readOnly}
                />
              </Detail>
              <Detail>
                <label htmlFor="status">
                  <StatusIcon width={18} />
                  <span>Status</span>
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
          {false && user.state === AuthState.SignedIn && <Comments />}
        </>
      )}
    </>
  );
};

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
  gap: 10px;
  & > label {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 5px;
    & > span {
      color: #222222;
      margin-bottom: 0;
      width: max-content;
      font-size: 16px;
      font-weight: 600;
    }
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

const PanelPageToolbar = styledComponents.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 25px;
  padding-top: 25px;
`

const PanelPageTitle = styledComponents.span`
  color: #000000;
  font-size: 18px;
  font-weight: 600;
`

const PanelPageToolbarAction = styledComponents.button`
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

export default connect((state) => ({
  user: state.user,
  tasks: state.tasks,
  app: state.app,
  comments: state.comments,
  users: state.users,
}))(Details);
