/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onPushNotification = /* GraphQL */ `
  subscription OnPushNotification($owner: String!) {
    onPushNotification(owner: $owner) {
      id
      projectId
      taskId
      commentId
      action
      field
      value
      hint
      read
      link
      mutator
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onPushUserUpdate = /* GraphQL */ `
  subscription OnPushUserUpdate($username: String!) {
    onPushUserUpdate(username: $username) {
      username
      firstName
      lastName
      updatedAt
      __typename
    }
  }
`;
export const onDismissNotification = /* GraphQL */ `
  subscription OnDismissNotification($owner: String!) {
    onDismissNotification(owner: $owner) {
      id
      updatedAt
      owner
      mutationId
      __typename
    }
  }
`;
export const onCreateOwnedProject = /* GraphQL */ `
  subscription OnCreateOwnedProject($owner: String!) {
    onCreateOwnedProject(owner: $owner) {
      id
      permalink
      rank
      title
      privacy
      permissions
      statusSet {
        id
        title
        synonym
        __typename
      }
      defaultStatus
      totalTasks
      createdAt
      updatedAt
      owner
      mutationId
      __typename
    }
  }
`;
export const onUpdateOwnedProject = /* GraphQL */ `
  subscription OnUpdateOwnedProject($owner: String!) {
    onUpdateOwnedProject(owner: $owner) {
      id
      permalink
      rank
      title
      privacy
      permissions
      statusSet {
        id
        title
        synonym
        __typename
      }
      defaultStatus
      updatedAt
      owner
      mutationId
      __typename
    }
  }
`;
export const onDeleteOwnedProject = /* GraphQL */ `
  subscription OnDeleteOwnedProject($owner: String!) {
    onDeleteOwnedProject(owner: $owner) {
      id
      updatedAt
      owner
      mutationId
      __typename
    }
  }
`;
export const onUpdateProject = /* GraphQL */ `
  subscription OnUpdateProject($id: String!) {
    onUpdateProject(id: $id) {
      id
      permalink
      rank
      title
      privacy
      permissions
      statusSet {
        id
        title
        synonym
        __typename
      }
      defaultStatus
      updatedAt
      owner
      mutationId
      __typename
    }
  }
`;
export const onDeleteProject = /* GraphQL */ `
  subscription OnDeleteProject($id: String!) {
    onDeleteProject(id: $id) {
      id
      updatedAt
      owner
      mutationId
      __typename
    }
  }
`;
export const onCreateTaskByProjectId = /* GraphQL */ `
  subscription OnCreateTaskByProjectId($projectId: ID!) {
    onCreateTaskByProjectId(projectId: $projectId) {
      id
      projectId
      permalink
      rank
      task
      description
      due
      tags
      status
      priority
      assignees
      watchers
      anonymousAssignees
      invitedAssignees
      createdAt
      updatedAt
      mutationId
      __typename
    }
  }
`;
export const onUpdateTaskByProjectId = /* GraphQL */ `
  subscription OnUpdateTaskByProjectId($projectId: ID!) {
    onUpdateTaskByProjectId(projectId: $projectId) {
      id
      projectId
      action
      field
      value
      updatedAt
      mutationId
      __typename
    }
  }
`;
export const onDeleteTaskByProjectId = /* GraphQL */ `
  subscription OnDeleteTaskByProjectId($projectId: ID!) {
    onDeleteTaskByProjectId(projectId: $projectId) {
      id
      projectId
      updatedAt
      mutationId
      __typename
    }
  }
`;
export const onCreateCommentByTaskId = /* GraphQL */ `
  subscription OnCreateCommentByTaskId($taskId: ID!) {
    onCreateCommentByTaskId(taskId: $taskId) {
      id
      taskId
      content
      createdAt
      updatedAt
      owner
      mutationId
      __typename
    }
  }
`;
export const onDeleteCommentByTaskId = /* GraphQL */ `
  subscription OnDeleteCommentByTaskId($taskId: ID!) {
    onDeleteCommentByTaskId(taskId: $taskId) {
      id
      taskId
      updatedAt
      mutationId
      __typename
    }
  }
`;
