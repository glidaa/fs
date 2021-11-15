import generateID from "./generateID";

export default (taskState, projectID, prevTask = null, nextTask = null) => {
  return {
    id: generateID(),
    projectID: projectID,
    prevTask: prevTask,
    nextTask: nextTask,
    task: taskState.task,
    description: taskState.description,
    due: taskState.due,
    tags: taskState.tags,
    status: taskState.status,
    priority: taskState.priority,
    assignees: [],
  };
};
