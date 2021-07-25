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
      tasksCount
      todoCount
      pendingCount
      doneCount
      privacy
      permissions
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
        tasksCount
        todoCount
        pendingCount
        doneCount
        privacy
        permissions
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
      tasksCount
      todoCount
      pendingCount
      doneCount
      privacy
      permissions
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
      tasksCount
      todoCount
      pendingCount
      doneCount
      privacy
      permissions
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onAssignTask = /* GraphQL */ `
  subscription OnAssignTask($assignee: String!) {
    onAssignTask(assignee: $assignee) {
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
export const onDisallowTask = /* GraphQL */ `
  subscription OnDisallowTask($assignee: String!) {
    onDisallowTask(assignee: $assignee) {
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
export const onUpdateAssignedTaskByProjectId = /* GraphQL */ `
  subscription OnUpdateAssignedTaskByProjectId(
    $projectID: ID!
    $assignee: String!
  ) {
    onUpdateAssignedTaskByProjectID(
      projectID: $projectID
      assignee: $assignee
    ) {
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
export const onDeleteAssignedTaskByProjectId = /* GraphQL */ `
  subscription OnDeleteAssignedTaskByProjectId(
    $projectID: ID!
    $assignee: String!
  ) {
    onDeleteAssignedTaskByProjectID(
      projectID: $projectID
      assignee: $assignee
    ) {
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
export const onCreateOwnedTaskByProjectId = /* GraphQL */ `
  subscription OnCreateOwnedTaskByProjectId($projectID: ID!) {
    onCreateOwnedTaskByProjectID(projectID: $projectID) {
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
export const onUpdateOwnedTaskByProjectId = /* GraphQL */ `
  subscription OnUpdateOwnedTaskByProjectId($projectID: ID!) {
    onUpdateOwnedTaskByProjectID(projectID: $projectID) {
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
export const onDeleteOwnedTaskByProjectId = /* GraphQL */ `
  subscription OnDeleteOwnedTaskByProjectId($projectID: ID!) {
    onDeleteOwnedTaskByProjectID(projectID: $projectID) {
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
      createdAt
      updatedAt
      owner
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
