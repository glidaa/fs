/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUserById = /* GraphQL */ `
  query GetUserById($userID: ID!) {
    getUserByID(userID: $userID) {
      id
      firstName
      lastName
      username
      email
      avatar
      sharedProjects
      watchedTasks
      assignedTasks
      createdAt
      updatedAt
      owner
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
