/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateNote = /* GraphQL */ `
  subscription OnCreateNote($owner: String) {
    onCreateNote(owner: $owner) {
      id
      url
      note
      isDone
      task
      description
      steps
      due
      assigned
      watcher
      project
      tag
      sprint
      status
      createdAt
      updatedAt
      owner
      comments {
        items {
          id
          noteID
          date
          content
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
    }
  }
`;
export const onUpdateNote = /* GraphQL */ `
  subscription OnUpdateNote($owner: String) {
    onUpdateNote(owner: $owner) {
      id
      url
      note
      isDone
      task
      description
      steps
      due
      assigned
      watcher
      project
      tag
      sprint
      status
      createdAt
      updatedAt
      owner
      comments {
        items {
          id
          noteID
          date
          content
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
    }
  }
`;
export const onDeleteNote = /* GraphQL */ `
  subscription OnDeleteNote($owner: String) {
    onDeleteNote(owner: $owner) {
      id
      url
      note
      isDone
      task
      description
      steps
      due
      assigned
      watcher
      project
      tag
      sprint
      status
      createdAt
      updatedAt
      owner
      comments {
        items {
          id
          noteID
          date
          content
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
    }
  }
`;
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment($owner: String) {
    onCreateComment(owner: $owner) {
      id
      noteID
      date
      content
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment($owner: String) {
    onUpdateComment(owner: $owner) {
      id
      noteID
      date
      content
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment($owner: String) {
    onDeleteComment(owner: $owner) {
      id
      noteID
      date
      content
      createdAt
      updatedAt
      owner
    }
  }
`;
