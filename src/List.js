import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Amplify, { API, graphqlOperation, Auth } from "aws-amplify";
import { AmplifyAuthenticator, AmplifyContainer } from "@aws-amplify/ui-react";
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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      value: "",
      selectedNote: "",
      displayAdd: true,
      displayUpdate: false,
      auth: false,
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
  }

  componentDidMount() {
    const localNotes = JSON.parse(window.localStorage.getItem("notes"))
    if (localNotes) {
      this.setState({
        notes: [...localNotes]
      })
    }
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
    if (this.currentNoteState !== "") {
      this.state.notes.push(this.currentNoteState);
      this.setState({
        value: ""
      });
      this.currentNoteState = {...this.initNoteState}
      window.localStorage.setItem("notes", JSON.stringify(this.state.notes))
    }
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
    event.preventDefault();
    event.stopPropagation();
    const updatedNotes = this.state.notes.map(item =>  {
        if(item.note === this.state.selectedNote){
            item = {...this.currentNoteState}
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
    this.currentNoteState = {...this.initNoteState}
    window.localStorage.setItem("notes", JSON.stringify(this.state.notes))
  }

  selectNote(note) {
    this.currentNoteState = {
      id: "",
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
        value: this.currentNoteState.note + suggestion
      }
    })
  }

  render() {
    return (
      <div className="App">
        {this.state.auth ? (
          <AmplifyContainer>
            <AmplifyAuthenticator />
          </AmplifyContainer>
        ) : (
            <div className="mainPage">
            <div className="leftSide">
            <div className="container">
              <Nestable
                collapsed={true}
                maxDepth={3}
                items={this.state.notes}
                renderItem={({ item }) => (
                  <div
                    className=" alert-primary alert-dismissible show"
                    role="alert"
                    className="list-menu"
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
                <form
                  data-testid="newTaskForm"
                  ref={(ref) => this.addForm = ref }
                  onSubmit={this.handleSubmit}
                >
                  <div>
                    <input
                      type="text"
                      className="task"
                      data-testid="newTaskField"
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
                <form
                  data-testid="updateTaskForm"
                  ref={(ref) => this.updateForm = ref }
                  onSubmit={this.handleUpdate}
                >
                  <div>
                    <input
                      type="text"
                      data-testid="updateTaskField"
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
            {this.state.isPanelOpened && (
              <div className="rightSide">
                <SidePanel
                  higherScope={this}
                  selectedNote={this.state.selectedNote}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
export default App;
