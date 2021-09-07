/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onPushUserUpdate = /* GraphQL */ `
  subscription OnPushUserUpdate($username: String!) {
    onPushUserUpdate(username: $username) {
      username
      firstName
      lastName
      gender
      birthdate
      email
      plan
      avatar
      sharedProjects
      watchedTasks
      assignedTasks
      createdAt
      updatedAt
    }
  }
`;
export const onCreateOwnedProject = /* GraphQL */ `
  subscription OnCreateOwnedProject($owner: String!) {
    onCreateOwnedProject(owner: $owner) {
      id
      prevProject
      nextProject
      permalink
      title
      tasksCount
      todoCount
      pendingCount
      doneCount
      privacy
      permissions
      createdAt
      updatedAt
      owner
      members
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
        tasksCount
        todoCount
        pendingCount
        doneCount
        privacy
        permissions
        createdAt
        updatedAt
        owner
        members
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
      tasksCount
      todoCount
      pendingCount
      doneCount
      privacy
      permissions
      updatedAt
      owner
      mutationID
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
      tasksCount
      todoCount
      pendingCount
      doneCount
      privacy
      permissions
      createdAt
      updatedAt
      owner
      members
    }
  }
`;
export const onCreateTaskByProjectId = /* GraphQL */ `
  subscription OnCreateTaskByProjectId($projectID: ID!) {
    onCreateTaskByProjectID(projectID: $projectID) {
      id
      projectID
      prevTask
      nextTask
      permalink
      task
      description
      due
      tags
      status
      createdAt
      updatedAt
      owner
      watchers
      assignees
    }
  }
`;
export const onUpdateTaskByProjectId = /* GraphQL */ `
  subscription OnUpdateTaskByProjectId($projectID: ID!) {
    onUpdateTaskByProjectID(projectID: $projectID) {
      id
      projectID
      prevTask
      nextTask
      permalink
      task
      description
      due
      tags
      status
      watchers
      assignees
      updatedAt
      mutationID
    }
  }
`;
export const onDeleteTaskByProjectId = /* GraphQL */ `
  subscription OnDeleteTaskByProjectId($projectID: ID!) {
    onDeleteTaskByProjectID(projectID: $projectID) {
      id
      projectID
      prevTask
      nextTask
      permalink
      task
      description
      due
      tags
      status
      createdAt
      updatedAt
      owner
      watchers
      assignees
    }
  }
`;
export const onCreateCommentByTaskId = /* GraphQL */ `
  subscription OnCreateCommentByTaskId($taskID: ID!) {
    onCreateCommentByTaskID(taskID: $taskID) {
      id
      taskID
      content
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateCommentByTaskId = /* GraphQL */ `
  subscription OnUpdateCommentByTaskId($taskID: ID!) {
    onUpdateCommentByTaskID(taskID: $taskID) {
      id
      taskID
      content
      updatedAt
      mutationID
    }
  }
`;
export const onDeleteCommentByTaskId = /* GraphQL */ `
  subscription OnDeleteCommentByTaskId($taskID: ID!) {
    onDeleteCommentByTaskID(taskID: $taskID) {
      id
      taskID
      content
      createdAt
      updatedAt
      owner
    }
  }
`;
