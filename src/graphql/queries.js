/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getNote = /* GraphQL */ `
  query GetNote($id: ID!) {
    getNote(id: $id) {
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
export const listNotes = /* GraphQL */ `
  query ListNotes(
    $filter: ModelNoteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
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
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
`;
