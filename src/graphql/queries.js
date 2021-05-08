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
      comment
      createdAt
      updatedAt
      owner
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
        comment
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
