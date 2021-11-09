export const getProjects = () => {
  const cache = {
    users: {},
    user: {},
    projects: {},
    tasks: {},
    comments: {},
    ...JSON.parse(window.localStorage.getItem("cachedData") || "{}")
  }; 
  return cache.projects;
}

export const getTasksByProjectID = (projectID) => {
  const cache = {
    users: {},
    user: {},
    projects: {},
    tasks: {},
    comments: {},
    ...JSON.parse(window.localStorage.getItem("cachedData") || "{}")
  }; 
  return cache.tasks[projectID];
}

export const getCommentsByTaskID = (taskID) => {
  const cache = {
    users: {},
    user: {},
    projects: {},
    tasks: {},
    comments: {},
    ...JSON.parse(window.localStorage.getItem("cachedData") || "{}")
  }; 
  return cache.comments[taskID];
}