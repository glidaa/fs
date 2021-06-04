import React, { Component, useEffect, useState } from "react";
import "../App.css";
import Amplify, { API, graphqlOperation, Auth, PubSub } from "aws-amplify";
import { createNote, deleteNote, updateNote } from "../graphql/mutations"
import { listNotes } from "../graphql/queries"
import { onCreateNote, onUpdateNote, onDeleteNote } from "../graphql/subscriptions"
import { v4 as uuidv4 } from 'uuid';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { AmplifyAuthenticator, AmplifyContainer, AmplifySignUp } from "@aws-amplify/ui-react";
import aws_exports from "../aws-exports";
import Nestable from "react-nestable";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {
  SIGNIN,
  SIGNUP,
  MARKASDONE,
  SIGNOUT,
  suggestionsList
} from "../constants";
import { ProjectsPanel } from "./ProjectsPanel";
import { SidePanel } from "./SidePanel";
import { TaskItem } from "./TaskItem";
import { NewTask } from "./NewTask";
import handlerIcon from "../assets/apps.svg";
import shareIcon from "../assets/share-outline.svg";

import styledComponents from "styled-components";


const Button = styledComponents.button`
background: none;
border: none;
font-size: 14px;
font-weight: 600;
display: none;

@media only screen and (max-width: 768px) {
display: block;
}


`;

Amplify.configure(aws_exports);
PubSub.configure(aws_exports);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      value: "",
      selectedNote: "",
      auth: false,
      isPanelShown: false,
      isDropdownOpened: false,
      authState: AuthState.SignedOut,
      authData: null, 
      hideShowPanel: false
    };
    this.initNoteState = {
      id: "",
      url: "",
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
      status: null
    }
    this.currentNoteState = {...this.initNoteState}
    this.subscriptions = [null, null, null, null]
    this.addForm = null;
    this.updateForm = null;
    this.currListOperation = null;
    this.subscription = null;
    this.handleChange = this.handleChange.bind(this);
    this.newData = this.newData.bind(this);
    this.updateData = this.updateData.bind(this);
  }

  async migrateLocalNotes() {
    const todos = JSON.parse(window.localStorage.getItem('notes'));
    if (todos && todos.length > 0) {
      todos.forEach(async item => {
        await API.graphql(graphqlOperation(createNote, { input: item }))
      })
    }
    window.localStorage.removeItem('notes')
  }

  async listNotes() {
    try {
      const operationID = uuidv4();
      this.currListOperation = operationID
      const notes = await API.graphql(graphqlOperation(listNotes))
      if (this.currListOperation === operationID) {
        this.setState({
          notes: [...notes.data.listNotes.items]
        });
      }
      if (this.currListOperation === operationID) {
        this.currListOperation = null;
      }
    } catch(e) {
      if (this.state.authState === AuthState.SignedIn) {
        console.error("Error occured while fetching notes", e)
      }
    }
  }

  handleGetNotes () {
    const localNotes = JSON.parse(window.localStorage.getItem("notes"))
    if (localNotes) {
      this.setState({
        notes: [...localNotes]
      })
    }
  }

  subscribeToDatabase () {
    const ownerData = {
      owner: this.state.authData.username
    }
    this.subscriptions[0] = API.graphql(graphqlOperation(onCreateNote, ownerData)).subscribe({
      next: () => this.listNotes(),
      error: error => console.warn(error)
    });
    this.subscriptions[1] = API.graphql(graphqlOperation(onUpdateNote, ownerData)).subscribe({
      next: () => this.listNotes(),
      error: error => console.warn(error)
    });
    this.subscriptions[2] = API.graphql(graphqlOperation(onDeleteNote, ownerData)).subscribe({
      next: () => this.listNotes(),
      error: error => console.warn(error)
    });
  }

  async componentDidMount() {
    onAuthUIStateChange(async (nextAuthState, authData) => {
      this.setState({ authState: nextAuthState, authData })
      if (nextAuthState === AuthState.SignedIn) {
        this.setState({ auth: false })
        this.subscribeToDatabase();
        await this.migrateLocalNotes();
        this.listNotes();
        window.removeEventListener("storage", this.handleGetNotes)
      }
		});
    if (this.state.authState === AuthState.SignedIn) {
      this.subscribeToDatabase();
      await this.migrateLocalNotes();
      this.listNotes();
    } else {
      this.handleGetNotes();
      window.addEventListener("storage", this.handleGetNotes())
    }
  }

  handleChange(event) {
    const {
      target: { value }
    } = event;
    let shouldUnSelectNote = false;
    let shouldSignOut = false;
    const special = /^.*(\/\w)$/m.exec(value)?.[1]
    this.currentNoteState.note = value.replace(/\/(\w|)/g, "")
    if (special === SIGNIN || special === SIGNUP) {
      if (this.state.authState !== AuthState.SignedIn) {
        if (!this.state.auth) {
          this.setState({
            auth: true
          });
          shouldUnSelectNote = true
        }
      }
    } else if (special === SIGNOUT) {
      if (this.state.authState === AuthState.SignedIn) {
        shouldUnSelectNote = true
        shouldSignOut = true
      }
    } else if (special === MARKASDONE) {
      this.currentNoteState.isDone = true
      shouldUnSelectNote = true
    }
    let suitableSuggestionsList = [...suggestionsList];

    if (this.currentNoteState.url == "" || this.currentNoteState.url == undefined) {
      let randomWords = require('random-words');
      this.currentNoteState.url = randomWords({exactly: 2, join: ''})
    }

    if (this.state.authState === AuthState.SignedIn) {
      suitableSuggestionsList = suitableSuggestionsList.filter(x => x !== "s")
      this.state.notes.map(item => {
        if (this.currentNoteState.url == item.url) {
          if (this.currentNoteState.id !== item.id) {
            let randomWords = require('random-words');
            let urlName = this.state.authData.username + '/' + randomWords({exactly: 2, join: ''})
            this.currentNoteState.url = urlName
          }
        }
      })
      window.history.replaceState(null, "New Page Title", urlName)
    } else if (this.state.authState !== AuthState.SignedIn) {
      suitableSuggestionsList = suitableSuggestionsList.filter(x => x !== "q")

      this.state.notes.map(item => {
        if (this.currentNoteState.url == item.url) {
          if (this.currentNoteState.id !== item.id) {
            let randomWords = require('random-words');
            this.currentNoteState.url = randomWords({exactly: 2, join: ''})
          }
        }
      })
      window.history.replaceState(null, "New Page Title", this.currentNoteState.url)
    }
    if (new RegExp(`^.*(\\/(\\/|[^${suitableSuggestionsList.join()}]))$`, "m").test(value)) {
      this.setState({ value: value.slice(0, -1) });
    } else {
      this.setState({ value: value });
    }
    if (/^.*\/$/m.test(value)) {
      this.setState({ isDropdownOpened: true })
    } else {
    this.setState({ isDropdownOpened: false })
    }
    this.updateData().then(() => {
      if (shouldUnSelectNote) {
        this.unSelectNote()
        if (shouldSignOut) {
          this.setState({ authState: AuthState.SignedOut, authData: null })
          this.subscriptions.forEach(x => {
            if (x !== null) {
              x.unsubscribe()
            }
          })
          this.subscriptions = this.subscriptions.map(() => null)
          this.setState({
            notes: []
          });
          this.handleGetNotes();
          window.addEventListener("storage", this.handleGetNotes)
          Auth.signOut()
        }
      }
    });
  }

  async newData() {
    this.unSelectNote();
    this.currentNoteState.id = uuidv4();
    this.state.notes.push(this.currentNoteState);
    this.selectNote(this.currentNoteState)
    if (this.state.authState === AuthState.SignedIn) {
      await API.graphql(graphqlOperation(createNote, { input: this.currentNoteState }))
    } else {
      window.localStorage.setItem("notes", JSON.stringify(this.state.notes))
    }
  }

  async handleDelete(id) {
    const updatedNotes = this.state.notes.filter(item => item.id !== id)
    this.setState({
        notes: [...updatedNotes],
    })
    if (this.state.authState === AuthState.SignedIn) {
      await API.graphql(graphqlOperation(deleteNote, { input: { id } }))
    } else {
      window.localStorage.setItem("notes", JSON.stringify(updatedNotes))
    }
  }

  async updateData() {
    const updatedNotes = this.state.notes.map(item =>  {
        if(item.id === this.state.selectedNote){
            item = {...this.currentNoteState}
        }
        return item;
    })
    this.setState({
        notes: [...updatedNotes]
    })
    if (this.currentNoteState.url == "" || this.currentNoteState.url == undefined) {
      let randomWords = require('random-words');
      this.currentNoteState.url = randomWords({exactly: 2, join: ''})
    }
    if (this.state.authState === AuthState.SignedIn) {
      await API.graphql(graphqlOperation(updateNote, { input: this.currentNoteState }))
      let urlName = this.state.authData.username + '/' + this.currentNoteState.url
      window.history.replaceState(null, "New Page Title", urlName)
    } else {
      window.localStorage.setItem("notes", JSON.stringify(updatedNotes))
      window.history.replaceState(null, "New Page Title", this.currentNoteState.url)
    }
  }

  unSelectNote () {
    this.setState({
      selectedNote: "",
      value: "",
      isPanelShown: false
    });
    this.currentNoteState = {...this.initNoteState}
  }

  selectNote(note) {
    this.currentNoteState = {
      id: note.id,
      url: note.url,
      note: note.note,
      isDone: false,
      task: note.task,
      description: note.description,
      steps: note.steps,
      due: note.due ? parseInt(note.due, 10) : Date.now(),
      assigned: note.assigned,
      watcher: note.watcher,
      project: note.project,
      tag: note.tag,
      sprint: note.sprint,
      status: note.status
    }
    this.setState({
      selectedNote: note.id,
      value: note.note,
      isPanelShown: true,
      hideShowPanel: false
    });
  }

  chooseSugestion(suggestion) {
    this.handleChange({
      target: {
        value: this.currentNoteState.note + suggestion
      }
    })
  }

  openUrlNote() {
    this.state.notes.map(item => {
      if (item.url == window.location.pathname) {
        this.state.selectedNote = item.id
      }
    })
  }

  setHideShowPanel = () => {
    this.setState((state)=> {
      return {
        hideShowPanel: !state.hideShowPanel,
        isPanelShown : false
      }
    })
  }

  render() {
    let {hideShowPanel} = this.state
    return (
      <div className="App">
        {this.state.auth ? (
          <AmplifyContainer>
            <AmplifyAuthenticator usernameAlias="email">
              <AmplifySignUp headerText="Create a new account" formFields={[
                {
                  label: "First Name",
                  placeholder: "First Name",
                  required: true,
                  type: "given_name",
                  custom: false
                },
                {
                  label: "Last Name",
                  placeholder: "Last Name",
                  required: true,
                  type: "family_name"
                },
                {
                  label: "Username",
                  placeholder: "Username",
                  required: true,
                  type: "username"
                },
                {
                  label: "Password",
                  placeholder: "Password",
                  required: true,
                  type: "password"
                },
                {
                  label: "Email Address",
                  placeholder: "Email Address",
                  required: true,
                  type: "email"
                },
                {
                  label: "Phone Number",
                  placeholder: "Phone Number",
                  required: true,
                  type: "phone_number"
                }
              ]} slot="sign-up" />
            </AmplifyAuthenticator>
          </AmplifyContainer>
        ) : (
            <div className="mainPage">
              <Router>
              <ProjectsPanel setHideShowPanel={this.setHideShowPanel} hideShowPanel={hideShowPanel}/>
            <div className="center">
            <div className="container">
              <button  style={{float: "right"}}>
                <img
                  alt="share button"
                  src={shareIcon}
                  width="20"
                  onClick={() => {navigator.clipboard.writeText(window.location.origin + '/' + this.currentNoteState.url)}}
                />
              </button>
              <Button onClick={()=> this.setHideShowPanel()}>{"< Projects "}</Button>
              <h1 className="title">Notes</h1>
              <Route path="/" exact>
                <Nestable
                  collapsed={true}
                  maxDepth={3}
                  items={this.state.notes}
                  handler={<img alt="item handler" src={handlerIcon} width="20" />}
                  className="list-menu"
                  renderItem={({ item, handler }) => (
                    <TaskItem
                      key={item.id}
                      item={item}
                      handler={handler}
                      higherScope={this}
                    />
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
                <NewTask higherScope={this}/>
              </Route>
              {/* <Route path='/:url' >
                {this.state.notes.map(item => {
                  if ('/' + item.url == window.location.pathname) {
                    if (this.state.selectedNote == '') {
                      this.selectNote(item)
                    }
                  }
                })}
              </Route> */}
              </div>
              </div>
              <SidePanel
              setHideShowPanel={()=> this.setState(state => {
                return {
                  isPanelShown : !state.isPanelShown,
                }
              })}
                higherScope={this}
                selectedNote={this.state.selectedNote}
              />
            </Router>
          </div>
        )}
      </div>
    );
  }
}

export default App;