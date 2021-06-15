import { useState, useRef } from "react"
import { connect } from "react-redux"
import { API, graphqlOperation } from "aws-amplify";
import styledComponents from "styled-components";
import { useOuterClick } from 'react-outer-click';
import searchForUser from "../utils/searchForUser";
import * as notesActions from "../actions/notes"
import * as usersActions from "../actions/users"
import userIcon from "../assets/person-outline.svg"
import Avatar from "./Avatar";
import { assignNote, disallowNote } from "../graphql/mutations";
import { NOT_ASSIGNED } from "../constants";

const AssigneeField = (props) => {
  const { app, users, value, readOnly, dispatch } = props
  const AssigneeFieldRef = useRef(null)
  const [isEdit, setIsEdit] = useState(false)
  const [filter, setFilter] = useState("")
  const [results, setResult] = useState([])
  const onChangeFilter = (e) => {
    const newFilter = e.target.value
    setFilter(newFilter)
    searchForUser(newFilter).then(res => {
      const resultArr = []
      for (const userResult of res.Users) {
        resultArr.push(Object.fromEntries(userResult.Attributes.map(x => [x.Name, x.Value])))
      }
      for (const item of resultArr) {
        if (!users[item.sub]) {
          dispatch(usersActions.addUser(
            item.sub,
            `${item.given_name} ${item.family_name}`
          ))
        }
      }
      setResult(resultArr)
    }).catch(err => {
      console.error(err)
    })
  }
  useOuterClick(AssigneeFieldRef, () => {
    if (isEdit) {
      setIsEdit(false);
    }
  })
  const handleAssignNote = (userInfo) => {
    setIsEdit(false)
    dispatch(notesActions.updateNote({
      id: app.selectedNote,
      assignee: userInfo.sub
    }))
    API.graphql(graphqlOperation(assignNote, {
      noteID: app.selectedNote,
      assignee: userInfo.sub
    })).catch(() => {
      dispatch(notesActions.updateNote({
        id: app.selectedNote,
        assignee: NOT_ASSIGNED
      }))
    })
  }
  const handleDisallowNote = () => {
    const AssigneeToBeRemoved = value
    dispatch(notesActions.updateNote({
      id: app.selectedNote,
      assignee: NOT_ASSIGNED
    }))
    API.graphql(graphqlOperation(disallowNote, {
      noteID: app.selectedNote,
      assignee: AssigneeToBeRemoved
    })).catch(() => {
      dispatch(notesActions.updateNote({
        id: app.selectedNote,
        assignee: AssigneeToBeRemoved
      }))
    })
  }
  return (
    <AssigneeFieldContainer ref={AssigneeFieldRef}>
      <AssigneeFieldBtn 
        onClick={() => !readOnly && value === NOT_ASSIGNED && !isEdit && setIsEdit(true)}
        isEdit={isEdit}
      >
      {value !== NOT_ASSIGNED && users[value] ? (
        <Avatar fullName={users[value]} />
      ) : (
        <img
          alt="assignee icon"
          src={userIcon}
          width="15"
        />
      )}
      {isEdit ? (
        <input
          name={props.name}
          value={filter}
          contentEditable={false}
          placeholder="Email…"
          onChange={onChangeFilter}
        />
      ) : (
        (value !== NOT_ASSIGNED && users[value] ? (
          <>
            <span>{users[value]}</span>
            {!readOnly && <span onClick={() => handleDisallowNote()}>×</span>}
          </>
        ) : (
          <span>No Assignee</span>
        ))
      )}
      </AssigneeFieldBtn>
      {isEdit && <SearchResults>
        {results.map(x => (
          <SearchResultsItem key={x.sub} onClick={() => handleAssignNote(x)}>
          <Avatar fullName={`${x.given_name} ${x.family_name}`} />
          <div>
            <span>{`${x.given_name} ${x.family_name}`}</span>
            <span>{x.email}</span>
          </div>
          </SearchResultsItem>
        ))}
      </SearchResults>}
    </AssigneeFieldContainer>
  )
}

const AssigneeFieldContainer = styledComponents.div`
  display: flex;
  flex-direction: column;
`

const AssigneeFieldBtn = styledComponents.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  font-size: 12px;
  border-radius: 6px;
  color: #6F7782;
  transition: background-color 0.3s;
  ${({ isEdit }) => isEdit ? `
    background-color: #FFFFFF;
    box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%),
    0 6px 16px 0 rgb(0 0 0 / 8%),
    0 9px 28px 8px rgb(0 0 0 / 5%);
    border: solid #F5F5F6 1px;
  ` : `
    border: solid transparent 2px;
    &:hover {
      background-color: #F5F5F6;
    }
  `}
  & > img {
    padding: 5px;
    border-radius: 100%;
    border: dashed #6F7782 1px;
  }
  & > input {
    border: none;
    width: 100%;
    font-size: 12px;
  }
`

const SearchResults = styledComponents.div`
  display: flex;
  flex-direction: column;
  border: 0.5px solid #E4E4E2;
  background-color: #FFFFFF;
  border-radius: 4px;
  z-index: 999;
  width: 100%;
  box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%),
              0 6px 16px 0 rgb(0 0 0 / 8%),
              0 9px 28px 8px rgb(0 0 0 / 5%);
`

const SearchResultsItem = styledComponents.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  padding: 10px;
  & > div:nth-child(2) {
    display: flex;
    flex-direction: column;
    & > span:nth-child(1) {
      font-weight: bold;
      color: #222222;
    }
    & > span:nth-child(2) {
      font-style: italic;
      color: grey;
    }
  }
  &:hover {
    background-color: #E4E4E2;
  }
`

export default connect((state) => ({
  app: state.app,
  users: state.users,
}))(AssigneeField);