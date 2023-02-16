import generateId from "./generateId";

const copyTask = (taskState, projectId, rank, existingIds) => {
  return {
    id: generateId(existingIds),
    projectId: projectId,
    rank: rank,
    task: taskState.task,
    description: taskState.description,
    due: taskState.due,
    tags: taskState.tags,
    status: taskState.status,
    priority: taskState.priority,
    assignees: [],
    anonymousAssignees: [],
    invitedAssignees: [],
  };
};

export default copyTask;
