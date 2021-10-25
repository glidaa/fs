/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUserByUsername = /* GraphQL */ `
  query GetUserByUsername($username: String!) {
    getUserByUsername(username: $username) {
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
export const listUsersByUsernames = /* GraphQL */ `
  query ListUsersByUsernames($usernames: [String!]!) {
    listUsersByUsernames(usernames: $usernames) {
      items {
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
  }
`;
export const getProjectById = /* GraphQL */ `
  query GetProjectById($projectID: ID!) {
    getProjectByID(projectID: $projectID) {
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
export const getProjectByPermalink = /* GraphQL */ `
  query GetProjectByPermalink($permalink: String!) {
    getProjectByPermalink(permalink: $permalink) {
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
export const getNotificationById = /* GraphQL */ `
  query GetNotificationById($notificationID: String!) {
    getNotificationByID(notificationID: $notificationID) {
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
export const listOwnedProjects = /* GraphQL */ `
  query ListOwnedProjects {
    listOwnedProjects {
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
export const listAssignedProjects = /* GraphQL */ `
  query ListAssignedProjects {
    listAssignedProjects {
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
export const listWatchedProjects = /* GraphQL */ `
  query ListWatchedProjects {
    listWatchedProjects {
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
export const listNotifications = /* GraphQL */ `
  query ListNotifications {
    listNotifications {
      items {
        id
        type
        payload
        createdAt
        updatedAt
        owner
        sender
      }
    }
  }
`;
export const listTasksForProject = /* GraphQL */ `
  query ListTasksForProject($projectID: ID!) {
    listTasksForProject(projectID: $projectID) {
      items {
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
      }
    }
  }
`;
export const listCommentsForTask = /* GraphQL */ `
  query ListCommentsForTask($taskID: ID!) {
    listCommentsForTask(taskID: $taskID) {
      items {
        id
        taskID
        content
        createdAt
        updatedAt
        owner
      }
    }
  }
`;
export const searchUsers = /* GraphQL */ `
  query SearchUsers(
    $filter: SearchableUserFilterInput
    $sort: SearchableUserSortInput
    $limit: Int
    $nextToken: String
    $from: Int
  ) {
    searchUsers(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
    ) {
      items {
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
      nextToken
      total
    }
  }
`;
