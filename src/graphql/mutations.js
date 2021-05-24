/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createNote = /* GraphQL */ `
  mutation CreateNote(
    $input: CreateNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    createNote(input: $input, condition: $condition) {
      id
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
export const updateNote = /* GraphQL */ `
  mutation UpdateNote(
    $input: UpdateNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    updateNote(input: $input, condition: $condition) {
      id
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
export const deleteNote = /* GraphQL */ `
  mutation DeleteNote(
    $input: DeleteNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    deleteNote(input: $input, condition: $condition) {
      id
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
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
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
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
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
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
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
