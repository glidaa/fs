/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onPushUserUpdate = /* GraphQL */ `
  subscription OnPushUserUpdate($username: String!) {
    onPushUserUpdate(username: $username) {
      username
      firstName
      lastName
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
export const onPushNotification = /* GraphQL */ `
  subscription OnPushNotification($owner: String!) {
    onPushNotification(owner: $owner) {
      id
      type
      payload
      createdAt
      updatedAt
      owner
      sender
    }
  }
`;
export const onDismissNotification = /* GraphQL */ `
  subscription OnDismissNotification($owner: String!) {
    onDismissNotification(owner: $owner) {
      id
      type
      payload
      createdAt
      updatedAt
      owner
      sender
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
      mutationID
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
      mutationID
    }
  }
`;
export const onUpdateProject = /* GraphQL */ `
  subscription OnUpdateProject($id: String!) {
    onUpdateProject(id: $id) {
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
export const onDeleteProject = /* GraphQL */ `
  subscription OnDeleteProject($id: String!) {
    onDeleteProject(id: $id) {
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
      mutationID
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
      priority
      createdAt
      updatedAt
      owner
      watchers
      assignees
      mutationID
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
      priority
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
      priority
      createdAt
      updatedAt
      owner
      watchers
      assignees
      mutationID
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
      mutationID
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
      mutationID
    }
  }
`;
