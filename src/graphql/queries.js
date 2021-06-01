/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getProjectById = /* GraphQL */ `
  query GetProjectById($projectID: ID!) {
    getProjectByID(projectID: $projectID) {
      id
      permalink
      title
      createdAt
      updatedAt
      owner
    }
  }
`;
export const getProjectByPermalink = /* GraphQL */ `
  query GetProjectByPermalink($permalink: String!) {
    getProjectByPermalink(permalink: $permalink) {
      id
      permalink
      title
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listOwnedProjects = /* GraphQL */ `
  query ListOwnedProjects {
    listOwnedProjects {
      items {
        id
        permalink
        title
        createdAt
        updatedAt
        owner
      }
    }
  }
`;
export const listAssignedProjects = /* GraphQL */ `
  query ListAssignedProjects {
    listAssignedProjects {
      items {
        id
        permalink
        title
        createdAt
        updatedAt
        owner
      }
    }
  }
`;
export const listNotesForProject = /* GraphQL */ `
  query ListNotesForProject($projectID: ID!) {
    listNotesForProject(projectID: $projectID) {
      items {
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
  }
`;
export const listCommentsForNote = /* GraphQL */ `
  query ListCommentsForNote($noteID: ID!) {
    listCommentsForNote(noteID: $noteID) {
      items {
        id
        noteID
        content
        createdAt
        updatedAt
        owner
      }
    }
  }
`;
