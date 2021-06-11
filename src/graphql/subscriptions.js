/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateOwnedProject = /* GraphQL */ `
  subscription OnCreateOwnedProject($owner: String!) {
    onCreateOwnedProject(owner: $owner) {
      id
      prevProject
      nextProject
      permalink
      title
      notesCount
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onImportOwnedProjects = /* GraphQL */ `
  subscription OnImportOwnedProjects($owner: String!) {
    onImportOwnedProjects(owner: $owner) {
      owner
      items {
        id
        prevProject
        nextProject
        permalink
        title
        notesCount
        createdAt
        updatedAt
        owner
      }
    }
  }
`;
export const onUpdateOwnedProject = /* GraphQL */ `
  subscription OnUpdateOwnedProject($owner: String!) {
    onUpdateOwnedProject(owner: $owner) {
      id
      prevProject
      nextProject
      permalink
      title
      notesCount
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteOwnedProject = /* GraphQL */ `
  subscription OnDeleteOwnedProject($owner: String!) {
    onDeleteOwnedProject(owner: $owner) {
      id
      prevProject
      nextProject
      permalink
      title
      notesCount
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onAssignNote = /* GraphQL */ `
  subscription OnAssignNote($assignee: String!) {
    onAssignNote(assignee: $assignee) {
      id
      projectID
      prevNote
      nextNote
      permalink
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
      prevNote
      nextNote
      permalink
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
export const onUpdateAssignedNoteByProjectId = /* GraphQL */ `
  subscription OnUpdateAssignedNoteByProjectId(
    $projectID: ID!
    $assignee: String!
  ) {
    onUpdateAssignedNoteByProjectID(
      projectID: $projectID
      assignee: $assignee
    ) {
      id
      projectID
      prevNote
      nextNote
      permalink
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
export const onDeleteAssignedNoteByProjectId = /* GraphQL */ `
  subscription OnDeleteAssignedNoteByProjectId(
    $projectID: ID!
    $assignee: String!
  ) {
    onDeleteAssignedNoteByProjectID(
      projectID: $projectID
      assignee: $assignee
    ) {
      id
      projectID
      prevNote
      nextNote
      permalink
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
      prevNote
      nextNote
      permalink
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
      prevNote
      nextNote
      permalink
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
      prevNote
      nextNote
      permalink
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
    onCreateCommentByNoteID(noteID: $noteID) {
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
    onUpdateCommentByNoteID(noteID: $noteID) {
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
    onDeleteCommentByNoteID(noteID: $noteID) {
      id
      noteID
      content
      createdAt
      updatedAt
      owner
    }
  }
`;
