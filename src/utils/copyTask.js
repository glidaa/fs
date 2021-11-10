import { v4 as uuidv4 } from "uuid";

export default (taskState, projectID, prevTask = null, nextTask = null) => {
  return {
    id: uuidv4(),
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
