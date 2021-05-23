import { useOuterClick } from 'react-outer-click';
import { useState, useRef, useReducer, useEffect } from "react"
import { DatePicker } from './DatePicker';
import {stateToHTML} from 'draft-js-export-html';
import {Editor, EditorState, ContentState, convertToRaw, convertFromRaw} from 'draft-js';
import { API, graphqlOperation, Auth } from "aws-amplify";
import { createComment } from "../graphql/mutations"
import { listComments } from "../graphql/queries"
import { onCreateComment } from "../graphql/subscriptions"
import { AuthState } from '@aws-amplify/ui-components';
import styledComponents from "styled-components";
import { Select } from "./Select"
import { Tag } from "./Tag"
import 'draft-js/dist/Draft.css';

export const SidePanel = (props) => {
  const newCommentRef = useRef(null)
  const [_, forceUpdate] = useReducer(x => x + 1, 0);
  const [isNewCommentOpened, setIsNewCommentOpened] = useState(false)
  const [comments, setComments] = useState([])
  const [commenters, setCommenters] = useState({})
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );
  const getUserName = async (username) => {
    let firstName = ""
    let lastName = ""
    const queryData = { 
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
      },
      queryStringParameters: {
          username: username,
      },
    };
    const data = await API.get("AdminQueries", "/getUser", queryData)
    for (const entry of data.UserAttributes) {
      if (entry.Name === "given_name") {
        firstName = entry.Value
      } else if (entry.Name === "family_name") {
        lastName = entry.Value
      }
    }
    return `${firstName} ${lastName}`
  }
  const openNewComment = () => {
    if (!isNewCommentOpened) {
      setIsNewCommentOpened(true);
    }
  }
  const submitComment = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const content = JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    await API.graphql(graphqlOperation(createComment, { input:  {
      content: content,
      noteID: props.higherScope.currentNoteState.id,
      date: Date.now()
    }}))
    setEditorState(EditorState.push(editorState, ContentState.createFromText('')))
    setIsNewCommentOpened(false);
  }
  const handleChange = (e) => {
    props.higherScope.currentNoteState[e.target.name] = e.target.value
    if (e.target.name === "note") {
      props.higherScope.setState({
        value: e.target.value
      })
    }
    props.higherScope.updateData()
    forceUpdate();
  }
  const getComments = async () => {
    try {
      const noteID = props.higherScope.currentNoteState.id;
      const nextComments = await API.graphql(graphqlOperation(listComments, {
        filter: {
          noteID: {
            eq: noteID
          }
        }
      }))
      for (const comment of nextComments.data.listComments.items) {
        if (!commenters[comment.owner]) {
          commenters[comment.owner] = await getUserName(comment.owner)
        }
      }
      setCommenters(commenters)
      setComments(nextComments.data.listComments.items)
    } catch(e) {
      if (props.higherScope.state.authState === AuthState.SignedIn) {
        console.error("Error occured while fetching comments", e)
      }
    }
  }
  useEffect(() => {
    if (props.higherScope.state.authState === AuthState.SignedIn){
      commenters[props.higherScope.state.authData.username] = `${props.higherScope.state.authData.attributes.given_name} ${props.higherScope.state.authData.attributes.family_name}`
      setCommenters(commenters)
    }
  }, [props.higherScope.state.authState])
  useEffect(() => {
    if (props.higherScope.state.authState === AuthState.SignedIn) {
      getComments()
      if (props.higherScope.subscriptions[3]) {
        props.higherScope.subscriptions[3].unsubscribe()
        props.higherScope.subscriptions[3] = null
      }
      const subscriptionData = {
        owner: props.higherScope.state.authData.username,
        filter: {
          noteID: {
            eq: props.higherScope.currentNoteState.id
          }
        }
      }
      props.higherScope.subscriptions[3] = API.graphql(graphqlOperation(onCreateComment, subscriptionData)).subscribe({
        next: () => getComments(),
        error: error => console.warn(error)
      })
    }
  }, [props.higherScope.currentNoteState.id])
  useOuterClick(newCommentRef, () => {
    if (isNewCommentOpened) {
      setIsNewCommentOpened(false);
    }
  })
  return (
    <Panel data-testid="sidePanel">
      {props.higherScope.state.isPanelShown && (
        <>
          <DetailsForm onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              name="note"
              placeholder="Note…"
              onChange={handleChange}
              value={
                props.higherScope.currentNoteState.note
                  ? props.higherScope.currentNoteState.note
                  : ""
              }
            ></input>
            <div>
            <label htmlFor="task">Task</label>
            <input
              type="text"
              name="task"
              placeholder="task"
              onChange={handleChange}
              value={
                props.higherScope.currentNoteState.task
                  ? props.higherScope.currentNoteState.task
                  : ""
              }
            ></input>
            </div>
            <div>
            <label htmlFor="description">Description</label>
            <input
              type="text"
              name="description"
              placeholder="description"
              onChange={handleChange}
              value={
                props.higherScope.currentNoteState.description
                  ? props.higherScope.currentNoteState.description
                  : ""
              }
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
              value={
                props.higherScope.currentNoteState.steps
                  ? props.higherScope.currentNoteState.steps
                  : ""
              }
            ></input>
            </div>
            <div>
            <label htmlFor="due">Due</label>
             <DatePicker
              name="due"
              onChange={handleChange}
              placeholder="due"
              value={props.higherScope.currentNoteState.due}
            />
            </div>
            <div>
            <label htmlFor="assigned">Assigned</label>
            <input
              type="text"
              name="assigned"
              placeholder="assigned"
              onChange={handleChange}
              value={
                props.higherScope.currentNoteState.assigned
                  ? props.higherScope.currentNoteState.assigned
                  : ""
              }
            ></input>
            </div>
            <div>
            <label htmlFor="watcher">Watcher</label>
            <input
              type="text"
              name="watcher"
              placeholder="watcher"
              onChange={handleChange}
              value={
                props.higherScope.currentNoteState.watcher
                  ? props.higherScope.currentNoteState.watcher
                  : ""
              }
            ></input>
            </div>
            <div>
            <label htmlFor="project">Project</label>
            <input
              type="text"
              name="project"
              placeholder="project"
              onChange={handleChange}
              value={
                props.higherScope.currentNoteState.project
                  ? props.higherScope.currentNoteState.project
                  : ""
              }
            ></input>
            </div>
            <div>
            <label htmlFor="tag">Tag</label>
            <Tag
              name="tag"
              onChange={handleChange}
              value={props.higherScope.currentNoteState.tag || ["Tag 1", "Tag2", "Tag 3", "Tag4", "Tag5"]}
            />
            </div>
            <div>
            <label htmlFor="sprint">Sprint</label>
            <input
              type="text"
              name="sprint"
              placeholder="sprint"
              onChange={handleChange}
              value={
                props.higherScope.currentNoteState.sprint
                  ? props.higherScope.currentNoteState.sprint
                  : ""
              }
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
              value={props.higherScope.currentNoteState.status}
            />
            </div>
            <input type="submit" name="submit" value="Submit"></input>
          </DetailsForm>
          {props.higherScope.state.authState === AuthState.SignedIn && <CommentsSection>
            {comments.map(x => (
              <CommentUnit key={x.id}>
                <Avatar>{
                  commenters[x.owner].split(" ")[0][0].toUpperCase() +
                  commenters[x.owner].split(" ")[1][0].toUpperCase()
                }</Avatar>
                <CommentContent>
                  <CommentHeader>
                    <div>
                      <span>{commenters[x.owner]}</span>
                      <span>{new Date(x.date).toLocaleString()}</span>
                    </div>
                    <div>

                    </div>
                  </CommentHeader>
                  <CommentBody
                    dangerouslySetInnerHTML={({
                      __html: stateToHTML(convertFromRaw(JSON.parse(x.content)))
                    })}
                  />
                </CommentContent>
              </CommentUnit>
            ))}
              <NewComment>
              <Avatar>{
                  commenters[props.higherScope.state.authData.username].split(" ")[0][0].toUpperCase() +
                  commenters[props.higherScope.state.authData.username].split(" ")[1][0].toUpperCase()
                }</Avatar>
                <CommentField onClick={openNewComment} ref={newCommentRef}>
                  <CommentInput>
                    <Editor
                      editorState={editorState}
                      onChange={setEditorState}
                      placeholder="Ask a question or post an update…"
                      expanded={isNewCommentOpened}
                    />
                  </CommentInput>
                  {isNewCommentOpened && <CommentControls>
                    <div>

                    </div>
                    <div>
                      <button onClick={submitComment}>Comment</button>
                    </div>
                  </CommentControls>}
                </CommentField>
              </NewComment>
          </CommentsSection>
          }
        </>
      )}
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
`;

const DetailsForm = styledComponents.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: calc(70vh);
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
    width: 100%;
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

const CommentsSection = styledComponents.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #F6F8F9;
  height: calc(30vh);
  overflow: auto;
  padding: 30px;
`
const CommentUnit = styledComponents.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`

const CommentContent = styledComponents.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
`

const CommentHeader = styledComponents.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  & > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    &:nth-child(1) {
      & > span:nth-child(1) {
        font-weight: bold;
        font-size: 14px;
      }
      & > span:nth-child(2) {
        font-size: 12px;
        color: #9DA3AA;
      }
    }
  }
`

const CommentBody = styledComponents.div`
  width: 100%;
  color: #000000;
`

const NewComment = styledComponents.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`

const CommentField = styledComponents.div`
  background-color: #FFFFFF;
  width: 100%;
  border-radius: 4px;
  border: 0.5px solid #9198a1;
  transition: border 0.3s, box-shadow 0.3s, height 0.3s;
  &:active {
    border: 0.5px solid #6F7782;
    box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
  }
`

const CommentInput = styledComponents.div`
  min-height: ${props => props.expanded ? "50px" : "16px"};
  max-height: 100px;
  outline: none;
  width: 100%;
  padding: 8px;
  font-size: 14px;
  overflow: auto;
`

const CommentControls = styledComponents.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  & > div {
    display: flex;
    flex-direction: row;
    gap: 10px;
    &:nth-child(2) {
      & > button {
        padding: 8px 12px;
        font-size: 14px;
        border-radius: 8px;
        background-color: #14AAF5;
        cursor: pointer;
        color: #FFFFFF;
        border: none;
        outline: none;
        transition: background-color 0.3s;
        &:hover {
          background-color: #129CE1;
        }
      }
    }
  }
`

const Avatar = styledComponents.div`
  border-radius: 100%;
  background-color: #FF93AF;
  color: #6B001D;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  min-height: 32px;
  width: 32px;
  height: 32px;
`
