/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createProject = /* GraphQL */ `
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
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
export const createTask = /* GraphQL */ `
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
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
export const createComment = /* GraphQL */ `
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      taskID
      content
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateProject = /* GraphQL */ `
  mutation UpdateProject($input: UpdateProjectInput!) {
    updateProject(input: $input) {
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
export const updateTask = /* GraphQL */ `
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
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
export const updateComment = /* GraphQL */ `
  mutation UpdateComment($input: UpdateCommentInput!) {
    updateComment(input: $input) {
      id
      taskID
      content
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteProjectAndTasks = /* GraphQL */ `
  mutation DeleteProjectAndTasks($projectID: ID!) {
    deleteProjectAndTasks(projectID: $projectID) {
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
export const deleteTaskAndComments = /* GraphQL */ `
  mutation DeleteTaskAndComments($taskId: ID!) {
    deleteTaskAndComments(taskId: $taskId) {
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
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment($commentID: ID!) {
    deleteComment(commentID: $commentID) {
      id
      taskID
      content
      createdAt
      updatedAt
      owner
    }
  }
`;
export const assignTask = /* GraphQL */ `
  mutation AssignTask($taskID: ID!, $assignee: String!) {
    assignTask(taskID: $taskID, assignee: $assignee) {
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
export const unassignTask = /* GraphQL */ `
  mutation UnassignTask($taskID: ID!, $assignee: String!) {
    unassignTask(taskID: $taskID, assignee: $assignee) {
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
export const importData = /* GraphQL */ `
  mutation ImportData($data: String!) {
    importData(data: $data) {
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
