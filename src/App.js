import React, { Component } from 'react';
import './App.css';
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Amplify, {API,graphqlOperation} from 'aws-amplify';
import aws_exports from './aws-exports'; // specify the location of aws-exports.js file on your project
import Nestable from 'react-nestable';
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
  constructor(props){
    super(props);
    this.state={
      id:"",
      notes:[],
      value:"",
      displayAdd:true,
      displayUpdate:false
    };
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
    if(this.state.notes.length > todos.length || this.state.notes.length === todos.length){
      window.localStorage.removeItem('notes')
    }
  }
  async componentDidMount(){
    const notes = await API.graphql(graphqlOperation(readNote));

    var todos = JSON.parse(window.localStorage.getItem('notes'));
    if(todos && todos.length > 0) {
      todos.map(item =>  {
        this.addNote(item);
      });
    }
   

    this.setState({notes:notes.data.listNotes.items});
  }

  handleChange(event) {
    this.setState({value:event.target.value});
  }
  async handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    const note = {"note":this.state.value}
    await API.graphql(graphqlOperation(createNote, note));
    this.listNotes();
    this.setState({value:""});
  }
  async handleDelete(id) {
    const noteId = {"id":id};
    await API.graphql(graphqlOperation(deleteNote, noteId));
    this.listNotes();
  }
  async handleUpdate(event) {
    event.preventDefault();
    event.stopPropagation();
    const note = {"id":this.state.id,"note":this.state.value};
    await API.graphql(graphqlOperation(updateNote, note));
    this.listNotes();
    this.setState({displayAdd:true,displayUpdate:false,value:""});
  }
  selectNote(note){
    this.setState({id:note.id,value:note.note,displayAdd:false,displayUpdate:true});
  }
  async listNotes(){
    const notes = await API.graphql(graphqlOperation(readNote));
    this.setState({notes:notes.data.listNotes.items});
  }
  

  render() {

    const data = [].concat(this.state.notes)
      .map((item,i)=> 
      <div className="alert alert-primary alert-dismissible show" role="alert">
        <span key={item.i} onClick={this.selectNote.bind(this, item)}>{item.note}</span>
        <button key={item.i} type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={this.handleDelete.bind(this, item.id)}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      )
      const renderItem = ({ item }) => item.text;
      console.log(this.state.notes)
    return (
      <div className="App">
         <br/>
        <div className="container">
        <Nestable
          collapsed={true}
          maxDepth={3}
          items={this.state.notes}
          renderItem={({ item, collapseIcon }) => (
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
            <form onSubmit={this.handleSubmit}>
              <div className="">
                <input type="text" className="task" placeholder="Enter task" aria-label="Note" aria-describedby="basic-addon2" value={this.state.value} onChange={this.handleChange}/>
              </div>
            </form>
          : null }
          {this.state.displayUpdate ?
            <form onSubmit={this.handleUpdate}>
              <div className="">
                <input type="text" className="task" placeholder="Update Note" aria-label="Note" aria-describedby="basic-addon2" value={this.state.value} onChange={this.handleChange}/>
                
              </div>
            </form>
          : null }
        </div>
        <AmplifySignOut />
      </div>
    );
  }
}
export default withAuthenticator(App, { includeGreetings: true });

