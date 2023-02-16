const prepareTaskToBeSent = (taskState) => {
  return {
    id: taskState.id,
    projectId: taskState.projectId,
    rank: taskState.rank,
    task: taskState.task,
    description: taskState.description,
    due: taskState.due,
    tags: taskState.tags,
    status: taskState.status,
    priority: taskState.priority,
  };
};

export default prepareTaskToBeSent;
