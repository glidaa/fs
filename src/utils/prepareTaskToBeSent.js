export default (taskState) => {
  return {
    id: taskState.id,
    projectID: taskState.projectID,
    prevTask: taskState.prevTask,
    nextTask: taskState.nextTask,
    task: taskState.task,
    description: taskState.description,
    due: taskState.due,
    tags: taskState.tags,
    status: taskState.status,
    priority: taskState.priority,
  };
};
