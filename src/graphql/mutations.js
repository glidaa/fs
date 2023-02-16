/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const pushNotification = /* GraphQL */ `
  mutation PushNotification($input: PushNotificationInput!) {
    pushNotification(input: $input) {
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
`;
export const pushUserUpdate = /* GraphQL */ `
  mutation PushUserUpdate($input: PushUserUpdateInput!) {
    pushUserUpdate(input: $input) {
      username
      firstName
      lastName
      updatedAt
    }
  }
`;
export const uploadExternal = /* GraphQL */ `
  mutation UploadExternal($url: AWSURL!, $taskId: ID!) {
    uploadExternal(url: $url, taskId: $taskId) {
      success
    }
  }
`;
export const createProject = /* GraphQL */ `
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
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
      mutationId
    }
  }
`;
export const createTask = /* GraphQL */ `
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
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
    }
  }
`;
export const createComment = /* GraphQL */ `
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      taskId
      content
      createdAt
      updatedAt
      owner
      mutationId
    }
  }
`;
export const updateProject = /* GraphQL */ `
  mutation UpdateProject($input: UpdateProjectInput!) {
    updateProject(input: $input) {
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
      updatedAt
      owner
      mutationId
    }
  }
`;
export const updateProjectTitle = /* GraphQL */ `
  mutation UpdateProjectTitle($input: UpdateProjectTitleInput!) {
    updateProjectTitle(input: $input) {
      id
      title
      updatedAt
      owner
      mutationId
    }
  }
`;
export const updateTaskRank = /* GraphQL */ `
  mutation UpdateTaskRank($input: UpdateTaskRankInput!) {
    updateTaskRank(input: $input) {
      id
      projectId
      action
      field
      value
      updatedAt
      mutationId
    }
  }
`;
export const updateTaskTask = /* GraphQL */ `
  mutation UpdateTaskTask($input: UpdateTaskTaskInput!) {
    updateTaskTask(input: $input) {
      id
      projectId
      action
      field
      value
      updatedAt
      mutationId
    }
  }
`;
export const updateTaskDescription = /* GraphQL */ `
  mutation UpdateTaskDescription($input: UpdateTaskDescriptionInput!) {
    updateTaskDescription(input: $input) {
      id
      projectId
      action
      field
      value
      updatedAt
      mutationId
    }
  }
`;
export const updateTaskDue = /* GraphQL */ `
  mutation UpdateTaskDue($input: UpdateTaskDueInput!) {
    updateTaskDue(input: $input) {
      id
      projectId
      action
      field
      value
      updatedAt
      mutationId
    }
  }
`;
export const updateTaskTags = /* GraphQL */ `
  mutation UpdateTaskTags($input: UpdateTaskTagsInput!) {
    updateTaskTags(input: $input) {
      id
      projectId
      action
      field
      value
      updatedAt
      mutationId
    }
  }
`;
export const updateTaskStatus = /* GraphQL */ `
  mutation UpdateTaskStatus($input: UpdateTaskStatusInput!) {
    updateTaskStatus(input: $input) {
      id
      projectId
      action
      field
      value
      updatedAt
      mutationId
    }
  }
`;
export const updateTaskPriority = /* GraphQL */ `
  mutation UpdateTaskPriority($input: UpdateTaskPriorityInput!) {
    updateTaskPriority(input: $input) {
      id
      projectId
      action
      field
      value
      updatedAt
      mutationId
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      username
      firstName
      lastName
      updatedAt
    }
  }
`;
export const deleteProjectAndTasks = /* GraphQL */ `
  mutation DeleteProjectAndTasks($input: DeleteProjectInput!) {
    deleteProjectAndTasks(input: $input) {
      id
      updatedAt
      owner
      mutationId
    }
  }
`;
export const deleteTaskAndComments = /* GraphQL */ `
  mutation DeleteTaskAndComments($input: DeleteTaskInput!) {
    deleteTaskAndComments(input: $input) {
      id
      projectId
      updatedAt
      mutationId
    }
  }
`;
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment($input: DeleteCommentInput!) {
    deleteComment(input: $input) {
      id
      taskId
      updatedAt
      mutationId
    }
  }
`;
export const dismissNotification = /* GraphQL */ `
  mutation DismissNotification($input: DismissNotificationInput!) {
    dismissNotification(input: $input) {
      id
      updatedAt
      owner
      mutationId
    }
  }
`;
export const dismissNotifications = /* GraphQL */ `
  mutation DismissNotifications {
    dismissNotifications {
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
export const addAssignee = /* GraphQL */ `
  mutation AddAssignee($input: AddAssigneeInput!) {
    addAssignee(input: $input) {
      id
      projectId
      action
      field
      value
      updatedAt
      mutationId
    }
  }
`;
export const removeAssignee = /* GraphQL */ `
  mutation RemoveAssignee($input: RemoveAssigneeInput!) {
    removeAssignee(input: $input) {
      id
      projectId
      action
      field
      value
      updatedAt
      mutationId
    }
  }
`;
export const addAnonymousAssignee = /* GraphQL */ `
  mutation AddAnonymousAssignee($input: AddAssigneeInput!) {
    addAnonymousAssignee(input: $input) {
      id
      projectId
      action
      field
      value
      updatedAt
      mutationId
    }
  }
`;
export const removeAnonymousAssignee = /* GraphQL */ `
  mutation RemoveAnonymousAssignee($input: RemoveAssigneeInput!) {
    removeAnonymousAssignee(input: $input) {
      id
      projectId
      action
      field
      value
      updatedAt
      mutationId
    }
  }
`;
export const addInvitedAssignee = /* GraphQL */ `
  mutation AddInvitedAssignee($input: AddAssigneeInput!) {
    addInvitedAssignee(input: $input) {
      id
      projectId
      action
      field
      value
      updatedAt
      mutationId
    }
  }
`;
export const removeInvitedAssignee = /* GraphQL */ `
  mutation RemoveInvitedAssignee($input: RemoveAssigneeInput!) {
    removeInvitedAssignee(input: $input) {
      id
      projectId
      action
      field
      value
      updatedAt
      mutationId
    }
  }
`;
export const addWatcher = /* GraphQL */ `
  mutation AddWatcher($input: AddWatcherInput!) {
    addWatcher(input: $input) {
      id
      projectId
      action
      field
      value
      updatedAt
      mutationId
    }
  }
`;
export const removeWatcher = /* GraphQL */ `
  mutation RemoveWatcher($input: RemoveWatcherInput!) {
    removeWatcher(input: $input) {
      id
      projectId
      action
      field
      value
      updatedAt
      mutationId
    }
  }
`;
export const importLocalData = /* GraphQL */ `
  mutation ImportLocalData($input: AWSJSON!) {
    importLocalData(input: $input) {
      result
    }
  }
`;
