import styledComponents from "styled-components"
import addIcon from "../assets/add-outline.svg"
import { handleCreateNote } from "../actions/notes"
import { initNoteState, OK, PENDING } from "../constants"
import { connect } from "react-redux";
import parseLinkedList from "../utils/parseLinkedList"

const NewTask = (props) => {
  const { app, notes, dispatch } = props
  return (
    <NewTaskContainer isInactive={app.noteAddingStatus === PENDING}>
       <div>
          <img alt="item handler" src={addIcon} width="20" />
          <div className="newTaskContainer">
            <span onClick={() => (
              app.noteAddingStatus === OK &&
              dispatch(
                handleCreateNote(
                  initNoteState(
                    app.selectedProject,
                    parseLinkedList(
                      notes,
                      "prevNote",
                      "nextNote"
                    ).reverse()[0]?.id
                  )
                )
              )
            )}>
              Note…
            </span>
          </div>
        </div>
    </NewTaskContainer>
  );
};

const NewTaskContainer = styledComponents.div`
  display: flex;
  flex-direction: row;
  margin: 10px 0 0;
  justify-content: space-between;
  align-items: center;
  border: 0.5px solid transparent;
  border-radius: 4px;
  padding: 4px 8px;
  transition: border 0.3s, box-shadow 0.3s;
  ${({ isInactive }) => isInactive ? `
    border: 0.5px solid #D3D3D3;
    ` : `
    &:focus {
      border: 0.5px solid #6F7782;
      box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
    }
    &:hover {
      border: 0.5px solid #9198a1;
    }
  `}
  & > div {
    display: flex;
    align-items: center;
    gap: 10px;
    width: calc(100% - 60px);
    & > div.newTaskContainer > span {
      width: 100%;
      user-select: none;
      cursor: text;
      color: #D3D3D3;
    }
  }
`
export default connect((state) => ({
  user: state.user,
  notes: state.notes,
  app: state.app
}))(NewTask);