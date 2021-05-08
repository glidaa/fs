import React, { Component } from 'react';
import './App.css';
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Amplify, { API, graphqlOperation, Auth } from 'aws-amplify';
import aws_exports from './aws-exports';
import Nestable from 'react-nestable';
import { createNote, deleteNote, updateNote } from "./graphqlOperations"
import { listNotes } from "./graphqlOperations"
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

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      notes: [],
      value: "",
      displayAdd: true,
      displayUpdate: false,
      isPanelOpened: false,
      isDropdownOpened: false
    };
    this.initNoteState = {
      id: "",
      note: "",
      isDone: false,
      task: null,
      description: null,
      steps: null,
      due: null,
      assigned: null,
      watcher: null,
      project: null,
      tag: null,
      sprint: null,
      status: null,
      comment: null
    }
    this.currentNoteState = {...this.initNoteState}
    this.addForm = null;
    this.updateForm = null;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.addNote = this.addNote.bind(this);
  }

  async addNote(note) {
    if(!this.state.notes.includes(note)){
      await API.graphql(graphqlOperation(createNote, note));
    }
    this.listNotes();
    const todos = JSON.parse(window.localStorage.getItem('notes'));
    if (todos) {
      if(this.state.notes.length > todos.length || this.state.notes.length === todos.length){
        window.localStorage.removeItem('notes')
      }
    }
  }

  async componentDidMount(){
    const notes = await API.graphql(graphqlOperation(listNotes));
    var todos = JSON.parse(window.localStorage.getItem('notes'));
    if(todos && todos.length > 0) {
      todos.map(item => this.addNote(item));
    }
    this.setState({
      notes: notes.data.listNotes.items
    });
  }

  handleChange(event) {
    const {
      target: { value }
    } = event;
    const special = /^.*(\/\w)$/m.exec(value)?.[1]
    this.currentNoteState.note = value.replace(/\/(\w|)/g, "")
    if (special === SIGNIN || special === SIGNUP) {
      if (!this.state.auth) {
        this.setState({
          auth: true
        });
      }
    } else if (special === SIGNOUT) {
      Auth.signOut()
    } else if (special === MARKASDONE) {
      this.currentNoteState.isDone = true
      if (this.state.displayAdd) {
        this.addForm.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
      } else if (this.state.displayUpdate) {
        this.updateForm.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
      }
    }
    if (new RegExp(`^.*(\\/(\\/|[^${suggestionsList.join()}]))$`, "m").test(value)) {
      this.setState({ value: value.slice(0, -1) });
    } else {
      this.setState({ value: value });
    }
    if (/^.*\/$/m.test(value)) {
      this.setState({ isDropdownOpened: true })
    } else {
      this.setState({ isDropdownOpened: false })
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    await API.graphql(graphqlOperation(createNote, this.currentNoteState));
    this.listNotes();
    this.setState({
      value: ""
    });
    this.currentNoteState = {...this.initNoteState}
  }

  async handleDelete(id) {
    const noteId = { 
      "id": id
    };
    await API.graphql(graphqlOperation(deleteNote, noteId));
    this.listNotes();
  }

  async handleUpdate(event) {
    event.preventDefault();
    event.stopPropagation();
    await API.graphql(graphqlOperation(updateNote, this.currentNoteState));
    this.listNotes();
    this.setState({
      displayAdd: true,
      displayUpdate: false,
      value: "",
      isPanelOpened: false
    });
    this.currentNoteState = {...this.initNoteState}
  }

  selectNote(note) {
    this.currentNoteState = {
      id: note.id,
      note: note.note,
      isDone: false,
      task: note.task,
      description: note.description,
      steps: note.steps,
      due: note.due,
      assigned: note.assigned,
      watcher: note.watcher,
      project: note.project,
      tag: note.tag,
      sprint: note.sprint,
      status: note.status,
      comment: note.comment
    }
    this.setState({
      value: note.note,
      displayAdd: false,
      displayUpdate: true,
      isPanelOpened: true
    });
  }

  chooseSugestion(suggestion) {
    this.handleChange({
      target: {
        value: this.currentNoteState.note + suggestion
      }
    })
  }

  async listNotes(){
    const notes = await API.graphql(graphqlOperation(listNotes));
    this.setState({
      notes: notes.data.listNotes.items
    });
  }

  render() {
    return (
      <div className="App">
         <br/>
        <div className="mainPage">
        <div className="leftSide">
        <div className="container">
        <Nestable
          collapsed={true}
          maxDepth={3}
          items={this.state.notes}
          renderItem={({ item, collapseIcon }) => (
            <div className=" alert-primary alert-dismissible show" role="alert">
        <span key={item.i} onClick={this.selectNote.bind(this, item)}>
          {item.isDone ? <strike>{item.note}</strike> : item.note}
        </span>
            <div className=" alert-primary alert-dismissible show list-menu" role="alert">
        <span key={item.i} onClick={this.selectNote.bind(this, item)}>{item.note}</span>
        <button key={item.i} type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={this.handleDelete.bind(this, item.id)}>
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
      
        <br/>

        <div className="container">
          {this.state.displayAdd ?
            <form ref={(ref) => this.addForm = ref} onSubmit={this.handleSubmit}>
              <div>
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
                    false,
                    false,
                    true,
                    true
                  ]}
                  suggestionsDescription={suggestionsDescription}
                />}
              </div>
            </form>
          : null }
          {this.state.displayUpdate ?
            <form ref={(ref) => this.updateForm = ref } onSubmit={this.handleUpdate}>
              <div>
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
                    false,
                    false,
                    true,
                    true
                  ]}
                  suggestionsDescription={suggestionsDescription}
                />}
              </div>
            </form>
          : null }
        </div>
        </div>
        {this.state.isPanelOpened && (
          <div className="rightSide">
          <SidePanel
            higherScope={this}
            selectedNote={this.currentNoteState}
          />
          </div>
        )}
        </div>
        <AmplifySignOut />
      </div>
    );
  }
}
export default withAuthenticator(App, { includeGreetings: true });
