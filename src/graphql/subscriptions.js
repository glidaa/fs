/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onAssignNote = /* GraphQL */ `
  subscription OnAssignNote($assignee: String!) {
    onAssignNote(assignee: $assignee) {
      id
      projectID
      note
      isDone
      task
      description
      steps
      due
      watcher
      tag
      sprint
      status
      createdAt
      updatedAt
      owner
      assignee
    }
  }
`;
export const onDisallowNote = /* GraphQL */ `
  subscription OnDisallowNote($assignee: String!) {
    onDisallowNote(assignee: $assignee) {
      id
      projectID
      note
      isDone
      task
      description
      steps
      due
      watcher
      tag
      sprint
      status
      createdAt
      updatedAt
      owner
      assignee
    }
  }
`;
export const onUpdateAssignedNote = /* GraphQL */ `
  subscription OnUpdateAssignedNote($assignee: String!) {
    onUpdateAssignedNote(assignee: $assignee) {
      id
      projectID
      note
      isDone
      task
      description
      steps
      due
      watcher
      tag
      sprint
      status
      createdAt
      updatedAt
      owner
      assignee
    }
  }
`;
export const onDeleteAssignedNote = /* GraphQL */ `
  subscription OnDeleteAssignedNote($assignee: String!) {
    onDeleteAssignedNote(assignee: $assignee) {
      id
      projectID
      note
      isDone
      task
      description
      steps
      due
      watcher
      tag
      sprint
      status
      createdAt
      updatedAt
      owner
      assignee
    }
  }
`;
export const onCreateOwnedNoteByProjectId = /* GraphQL */ `
  subscription OnCreateOwnedNoteByProjectId($projectID: ID!) {
    onCreateOwnedNoteByProjectID(projectID: $projectID) {
      id
      projectID
      note
      isDone
      task
      description
      steps
      due
      watcher
      tag
      sprint
      status
      createdAt
      updatedAt
      owner
      assignee
    }
  }
`;
export const onUpdateOwnedNoteByProjectId = /* GraphQL */ `
  subscription OnUpdateOwnedNoteByProjectId($projectID: ID!) {
    onUpdateOwnedNoteByProjectID(projectID: $projectID) {
      id
      projectID
      note
      isDone
      task
      description
      steps
      due
      watcher
      tag
      sprint
      status
      createdAt
      updatedAt
      owner
      assignee
    }
  }
`;
export const onDeleteOwnedNoteByProjectId = /* GraphQL */ `
  subscription OnDeleteOwnedNoteByProjectId($projectID: ID!) {
    onDeleteOwnedNoteByProjectID(projectID: $projectID) {
      id
      projectID
      note
      isDone
      task
      description
      steps
      due
      watcher
      tag
      sprint
      status
      createdAt
      updatedAt
      owner
      assignee
    }
  }
`;
export const onCreateCommentByNoteId = /* GraphQL */ `
  subscription OnCreateCommentByNoteId($noteID: ID!) {
    onCreateCommentByNoteId(noteID: $noteID) {
      id
      noteID
      content
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateCommentByNoteId = /* GraphQL */ `
  subscription OnUpdateCommentByNoteId($noteID: ID!) {
    onUpdateCommentByNoteId(noteID: $noteID) {
      id
      noteID
      content
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteCommentByNoteId = /* GraphQL */ `
  subscription OnDeleteCommentByNoteId($noteID: ID!) {
    onDeleteCommentByNoteId(noteID: $noteID) {
      id
      noteID
      content
      createdAt
      updatedAt
      owner
    }
  }
`;
