/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const searchUserToAssign = /* GraphQL */ `
  query SearchUserToAssign($searchQuery: String!, $taskId: ID!) {
    searchUserToAssign(searchQuery: $searchQuery, taskId: $taskId) {
      items {
        username
        firstName
        lastName
        email
        createdAt
        updatedAt
      }
    }
  }
`;
export const searchUserToWatch = /* GraphQL */ `
  query SearchUserToWatch($searchQuery: String!, $taskId: ID!) {
    searchUserToWatch(searchQuery: $searchQuery, taskId: $taskId) {
      items {
        username
        firstName
        lastName
        email
        createdAt
        updatedAt
      }
    }
  }
`;
export const initializeUpload = /* GraphQL */ `
  query InitializeUpload($contentType: String!, $taskId: ID!) {
    initializeUpload(contentType: $contentType, taskId: $taskId) {
      presignedUrl
    }
  }
`;
export const listOwnedProjects = /* GraphQL */ `
  query ListOwnedProjects($owner: String) {
    listOwnedProjects(owner: $owner) {
      items {
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
        }
        defaultStatus
        totalTasks
        createdAt
        updatedAt
        owner
      }
    }
  }
`;
export const listAssignedProjects = /* GraphQL */ `
  query ListAssignedProjects($assignee: String) {
    listAssignedProjects(assignee: $assignee) {
      items {
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
        }
        defaultStatus
        totalTasks
        createdAt
        updatedAt
        owner
      }
    }
  }
`;
export const listWatchedProjects = /* GraphQL */ `
  query ListWatchedProjects($watcher: String) {
    listWatchedProjects(watcher: $watcher) {
      items {
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
        }
        defaultStatus
        totalTasks
        createdAt
        updatedAt
        owner
      }
    }
  }
`;
export const listNotifications = /* GraphQL */ `
  query ListNotifications {
    listNotifications {
      items {
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
      }
    }
  }
`;
export const getUserByUsername = /* GraphQL */ `
  query GetUserByUsername($username: String!) {
    getUserByUsername(username: $username) {
      username
      firstName
      lastName
      email
      createdAt
      updatedAt
    }
  }
`;
export const listUsersByUsernames = /* GraphQL */ `
  query ListUsersByUsernames($usernames: [String!]!) {
    listUsersByUsernames(usernames: $usernames) {
      items {
        username
        firstName
        lastName
        email
        createdAt
        updatedAt
      }
    }
  }
`;
export const listAttachmentsByTaskId = /* GraphQL */ `
  query ListAttachmentsByTaskId($taskId: ID!) {
    listAttachmentsByTaskId(taskId: $taskId) {
      items {
        id
        filename
        contentType
        size
        url
      }
    }
  }
`;
export const getProjectById = /* GraphQL */ `
  query GetProjectById($projectId: ID!) {
    getProjectById(projectId: $projectId) {
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
      }
      defaultStatus
      totalTasks
      createdAt
      updatedAt
      owner
    }
  }
`;
export const getProjectByPermalink = /* GraphQL */ `
  query GetProjectByPermalink($permalink: String!, $owner: String!) {
    getProjectByPermalink(permalink: $permalink, owner: $owner) {
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
      }
      defaultStatus
      totalTasks
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listHistoryByTaskId = /* GraphQL */ `
  query ListHistoryByTaskId($taskId: ID!) {
    listHistoryByTaskId(taskId: $taskId) {
      items {
        id
        action
        field
        value
        createdAt
        updatedAt
        owner
      }
    }
  }
`;
export const listTasksForProject = /* GraphQL */ `
  query ListTasksForProject($projectId: ID!) {
    listTasksForProject(projectId: $projectId) {
      items {
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
        anonymousAssignees
        invitedAssignees
        watchers
        createdAt
        updatedAt
      }
    }
  }
`;
export const listCommentsForTask = /* GraphQL */ `
  query ListCommentsForTask($taskId: ID!) {
    listCommentsForTask(taskId: $taskId) {
      items {
        id
        taskId
        content
        createdAt
        updatedAt
        owner
      }
    }
  }
`;
