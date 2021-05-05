import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Amplify, { API, graphqlOperation, Auth, strike } from "aws-amplify";
import {
  AmplifyAuthenticator,
  AmplifyContainer,
  AmplifySignOut,
} from "@aws-amplify/ui-react";
import aws_exports from "./aws-exports"; // specify the location of aws-exports.js file on your project
import Nestable from "react-nestable";
import {
  SIGNIN,
  SIGNUP,
  MARKASDONE,
  SIGNOUT,
  suggestionsList,
  suggestionsDescription
} from "./constants";
import { SidePanel } from "./SidePanel";
import { Specials } from "./Specials"
Amplify.configure(aws_exports);

const createNote = `mutation createNote($note: String!){
  createNote(input:{
    note: $note
  }){
    __typename
    id
    note
  }
}`;

const readNote = `query listNotes{
  listNotes{
    items{
      __typename
      id
      note
    }
  }
}`;

const updateNote = `mutation updateNote($id: ID!,$note: String){
  updateNote(input:{
    id: $id
    note: $note
  }){
    __typename
    id
    note
  }
}`;

const deleteNote = `mutation deleteNote($id: ID!){
  deleteNote(input:{
    id: $id
  }){
    __typename
    id
    note
  }
}`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      notes: [],
      value: "",
      selectedNote: "",
      displayAdd: true,
      displayUpdate: false,
      auth: false,
      isPanelOpened: false,
      isDropdownOpened: false
    };
    this.isDone = false
    this.addForm = null;
    this.updateForm = null;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  async componentDidMount() {
    const notes = await API.graphql(graphqlOperation(readNote));
    this.setState({ notes: notes.data.listNotes.items });
  }

  handleChange(event) {
    const {
      target: { value }
    } = event;
    const special = /^.*(\/\w)$/m.exec(value)?.[1]
    if (special === SIGNIN || special === SIGNUP) {
      if (!this.state.auth) {
        this.setState({
          auth: true
        });
      }
    } else if (special === SIGNOUT) {
      Auth.signOut()
    }
    if (/^.*\/\/$/m.test(event.target.value)) {
      this.setState({ value: event.target.value.replace(/^(.*)\/\/$/m, "$1/") });
    } else {
      this.setState({ value: event.target.value });
    }
    if (/^.*\/$/m.test(event.target.value)) {
      this.setState({ isDropdownOpened: true })
    } else {
      this.setState({ isDropdownOpened: false })
    }
    if (special === MARKASDONE) {
      this.isDone = true
      if (this.state.displayAdd) {
        this.addForm.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
      } else if (this.state.displayUpdate) {
        this.updateForm.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
      }
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    const note = {
      note: this.state.value.replace(/^(.*)(?:\/\w|\/)$/m, "$1"),
      isDone: this.isDone
    };
    this.state.notes.push(note);
    this.setState({
      value: ""
    });
    this.isDone = false
    window.localStorage.setItem("notes", JSON.stringify(this.state.notes))
  }

  async handleDelete(id) {
    const updatedNotes = this.state.notes.map(item =>  {
        if(item.note === id.note){
            item.note = '';
        }
        return item;
    })
    this.setState({
        notes: updatedNotes,
    })
    window.localStorage.setItem("notes", JSON.stringify(this.state.notes))
  }

  async handleUpdate(event) {
    const { target: { value }} = event;
    event.preventDefault();
    event.stopPropagation();
    const updatedNotes = this.state.notes.map(item =>  {
        if(item.note === this.state.selectedNote){
            item.note = this.state.value.replace(/^(.*)(?:\/\w|\/)$/m, "$1");
            item.isDone = this.isDone;
        }
        return item;
    })
    this.setState({
        notes: updatedNotes,
        displayAdd: true,
        displayUpdate: false,
        value: "",
        isPanelOpened: false
    })
    this.isDone = false
    window.localStorage.setItem("notes", JSON.stringify(this.state.notes))
  }

  selectNote(note) {
    this.setState({
      id: note.id,
      selectedNote: note.note,
      value: note.note,
      displayAdd: false,
      displayUpdate: true,
      isPanelOpened: true
    });
  }

  chooseSugestion(suggestion) {
    this.handleChange({
      target: {
        value: this.state.value + suggestion
      }
    })
  }
  
  async listNotes() {
    const notes = await API.graphql(graphqlOperation(readNote));
    this.setState({ notes: notes.data.listNotes.items });
  }

  render() {
    const data = [].concat(this.state.notes).map((item, i) => (
      <div className="alert alert-primary alert-dismissible show" role="alert">
        <span key={item.i} onClick={this.selectNote.bind(this, item)}>
          {item.note}
        </span>
        <button
          key={item.i}
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
          onClick={this.handleDelete.bind(item.note)}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    ));
    const renderItem = ({ item }) => item.text;
    return (
      <div className="App">
        {this.state.auth ? (
          <AmplifyContainer>
            <AmplifyAuthenticator />
          </AmplifyContainer>
        ) : (
            <div className="mainPage">
            {this.state.isPanelOpened && (
              <div className="leftSide">
                <SidePanel
                  selectedNote={this.state.selectedNote}
                />
              </div>
            )}
            <div className="rightSide">
            <div className="container">
              <Nestable
                collapsed={true}
                maxDepth={3}
                items={this.state.notes}
                renderItem={({ item, collapseIcon }) => (
                  <div
                    className=" alert-primary alert-dismissible show"
                    role="alert"
                  >
                    <span
                      key={item.i}
                      onClick={this.selectNote.bind(this, item)}
                    >
                      {item.isDone ? <strike>{item.note}</strike> : item.note}
                    </span>
                    <button
                      key={item.i}
                      type="button"
                      className="close"
                      data-dismiss="alert"
                      aria-label="Close"
                      onClick={this.handleDelete.bind(this, item)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                )}
                onChange={this.handleOnChangeSort}
                renderCollapseIcon={({ isCollapsed }) =>
                  isCollapsed ? (
                    <span className="iconCollapse">+</span>
                  ) : (
                    <span className="iconCollapse">-</span>
                  )
                }
              />
            </div>

            <br />

            <div className="container">
              {this.state.displayAdd ? (
                <form ref={(ref) => this.addForm = ref } onSubmit={this.handleSubmit}>
                  <div className="">
                    <input
                      type="text"
                      className="task"
                      placeholder="Enter task"
                      aria-label="Note"
                      aria-describedby="basic-addon2"
                      value={this.state.value}
                      onChange={this.handleChange}
                    />
                    {this.state.isDropdownOpened && <Specials
                      onChooseSuggestion={this.chooseSugestion.bind(this)}
                      suggestionsList={suggestionsList}
                      suggestionsCondition={[
                        true,
                        true,
                        true,
                        false
                      ]}
                      suggestionsDescription={suggestionsDescription}
                    />}
                  </div>
                </form>
              ) : null}
              {this.state.displayUpdate ? (
                <form ref={(ref) => this.updateForm = ref } onSubmit={this.handleUpdate}>
                  <div className="">
                    <input
                      type="text"
                      className="task"
                      placeholder="Update Note"
                      aria-label="Note"
                      aria-describedby="basic-addon2"
                      value={this.state.value}
                      onChange={this.handleChange}
                    />
                    {this.state.isDropdownOpened && <Specials
                      onChooseSuggestion={this.chooseSugestion.bind(this)}
                      suggestionsList={suggestionsList}
                      suggestionsCondition={[
                        true,
                        true,
                        true,
                        false
                      ]}
                      suggestionsDescription={suggestionsDescription}
                    />}
                  </div>
                </form>
              ) : null}
            </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default App;
