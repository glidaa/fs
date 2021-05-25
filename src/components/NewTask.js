import styledComponents from "styled-components"
import addIcon from "../assets/add-outline.svg"

export const NewTask = (props) => {
  return (
    <NewTaskContainer>
       <div>
          <img alt="item handler" src={addIcon} width="20" />
          <div className="newTaskContainer">
            <span data-testid="newTaskBtn" onClick={props.higherScope.newData}>Note…</span>
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
  &:focus {
    border: 0.5px solid #6F7782;
    box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
  }
  &:hover {
    border: 0.5px solid #9198a1;
  }
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
