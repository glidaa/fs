/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const pushUserUpdate = /* GraphQL */ `
  mutation PushUserUpdate($input: PushUserUpdateInput!) {
    pushUserUpdate(input: $input) {
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
export const pushProjectUpdate = /* GraphQL */ `
  mutation PushProjectUpdate($input: PushProjectUpdateInput!) {
    pushProjectUpdate(input: $input) {
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
export const pushNotification = /* GraphQL */ `
  mutation PushNotification($input: PushNotificationInput!) {
    pushNotification(input: $input) {
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
      members
      mutationID
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
export const createComment = /* GraphQL */ `
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
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
      updatedAt
      owner
      mutationID
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
      priority
      watchers
      assignees
      updatedAt
      mutationID
    }
  }
`;
export const updateComment = /* GraphQL */ `
  mutation UpdateComment($input: UpdateCommentInput!) {
    updateComment(input: $input) {
      id
      taskID
      content
      updatedAt
      mutationID
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
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
export const deleteProjectAndTasks = /* GraphQL */ `
  mutation DeleteProjectAndTasks($input: DeleteProjectInput!) {
    deleteProjectAndTasks(input: $input) {
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
export const deleteTaskAndComments = /* GraphQL */ `
  mutation DeleteTaskAndComments($input: DeleteTaskInput!) {
    deleteTaskAndComments(input: $input) {
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
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment($input: DeleteCommentInput!) {
    deleteComment(input: $input) {
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
export const dismissNotification = /* GraphQL */ `
  mutation DismissNotification($notificationID: ID!) {
    dismissNotification(notificationID: $notificationID) {
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
export const dismissNotifications = /* GraphQL */ `
  mutation DismissNotifications {
    dismissNotifications {
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
export const assignTask = /* GraphQL */ `
  mutation AssignTask($input: AssignTaskInput!) {
    assignTask(input: $input) {
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
export const unassignTask = /* GraphQL */ `
  mutation UnassignTask($input: UnassignTaskInput!) {
    unassignTask(input: $input) {
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
export const addWatcher = /* GraphQL */ `
  mutation AddWatcher($input: AddWatcherInput!) {
    addWatcher(input: $input) {
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
export const removeWatcher = /* GraphQL */ `
  mutation RemoveWatcher($input: RemoveWatcherInput!) {
    removeWatcher(input: $input) {
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
        members
      }
    }
  }
`;
