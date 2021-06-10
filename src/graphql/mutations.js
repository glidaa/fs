/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createProject = /* GraphQL */ `
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
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
export const createNote = /* GraphQL */ `
  mutation CreateNote($input: CreateNoteInput!) {
    createNote(input: $input) {
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
export const createComment = /* GraphQL */ `
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      noteID
      content
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateProject = /* GraphQL */ `
  mutation UpdateProject($input: UpdateProjectInput!) {
    updateProject(input: $input) {
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
export const updateNote = /* GraphQL */ `
  mutation UpdateNote($input: UpdateNoteInput!) {
    updateNote(input: $input) {
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
export const updateComment = /* GraphQL */ `
  mutation UpdateComment($input: UpdateCommentInput!) {
    updateComment(input: $input) {
      id
      noteID
      content
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteProjectAndNotes = /* GraphQL */ `
  mutation DeleteProjectAndNotes($projectID: ID!) {
    deleteProjectAndNotes(projectID: $projectID) {
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
export const deleteNoteAndComments = /* GraphQL */ `
  mutation DeleteNoteAndComments($noteId: ID!) {
    deleteNoteAndComments(noteId: $noteId) {
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
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment($commentID: ID!) {
    deleteComment(commentID: $commentID) {
      id
      noteID
      content
      createdAt
      updatedAt
      owner
    }
  }
`;
export const assignNote = /* GraphQL */ `
  mutation AssignNote($noteID: ID!, $assignee: String!) {
    assignNote(noteID: $noteID, assignee: $assignee) {
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
export const disallowNote = /* GraphQL */ `
  mutation DisallowNote($noteID: ID!, $assignee: String!) {
    disallowNote(noteID: $noteID, assignee: $assignee) {
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
export const importData = /* GraphQL */ `
  mutation ImportData($data: String!) {
    importData(data: $data) {
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
