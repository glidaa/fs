import { AuthState } from "../constants";

const initCacheValue = {
  notifications: [],
  projects: {},
  tasks: {},
  comments: {},
  attachments: {},
  history: {},
  users: {},
  user: {
    state: AuthState.SignedOut,
    data: null,
  },
};

export const getCache = () => {
  return {
    ...initCacheValue,
    ...JSON.parse(window.localStorage.getItem("cachedData") || "{}"),
  };
};

export const resetCache = (isSigningIn = false) => {
  const localCache = getCache();
  const localData = Object.values(localCache.projects);
  for (const project of localData) {
    const projectId = project.id;
    project.tasks = Object.values(localCache.tasks[projectId] || {});
  }
  window.localStorage.setItem(
    "cachedData",
    JSON.stringify({
      ...initCacheValue,
      ...(isSigningIn && {
        localData,
      }),
    })
  );
};


export const getLocalData = () => {
  return getCache().localData || null;
}

export const deleteLocalData = () => {
  const cache = getCache();
  delete cache.localData;
  window.localStorage.setItem("cachedData", JSON.stringify(cache));
};

export const getNotifications = () => {
  return getCache().notifications;
};

export const getProjects = () => {
  return getCache().projects;
};

export const getTasksByProjectId = (projectId) => {
  return getCache().tasks[projectId] || {};
};

export const getCommentsByTaskId = (taskId) => {
  return getCache().comments[taskId] || {};
};

export const getHistoryByTaskId = (taskId) => {
  return getCache().history[taskId] || [];
};

export const getAttachmentsByTaskId = (taskId) => {
  return getCache().attachments[taskId] || [];
};

export const getUser = () => {
  return getCache().user;
};

export const getUsers = () => {
  return getCache().users;
};

export const setNotifications = (notifications) => {
  window.localStorage.setItem(
    "cachedData",
    JSON.stringify({ ...getCache(), notifications })
  );
};

export const setProjects = (projects) => {
  window.localStorage.setItem(
    "cachedData",
    JSON.stringify({ ...getCache(), projects })
  );
};

export const setTasksByProjectId = (projectId, tasks) => {
  window.localStorage.setItem(
    "cachedData",
    JSON.stringify({
      ...getCache(),
      tasks: { ...getCache().tasks, [projectId]: tasks },
    })
  );
};

export const setCommentsByTaskId = (taskId, comments) => {
  window.localStorage.setItem(
    "cachedData",
    JSON.stringify({
      ...getCache(),
      comments: { ...getCache().comments, [taskId]: comments },
    })
  );
};

export const setHistoryByTaskId = (taskId, history) => {
  window.localStorage.setItem(
    "cachedData",
    JSON.stringify({
      ...getCache(),
      history: { ...getCache().history, [taskId]: history },
    })
  );
};

export const setAttachmentsByTaskId = (taskId, attachments) => {
  window.localStorage.setItem(
    "cachedData",
    JSON.stringify({
      ...getCache(),
      attachments: { ...getCache().attachments, [taskId]: attachments },
    })
  );
};

export const setUser = (user) => {
  window.localStorage.setItem(
    "cachedData",
    JSON.stringify({ ...getCache(), user })
  );
};

export const setUsers = (users) => {
  window.localStorage.setItem(
    "cachedData",
    JSON.stringify({ ...getCache(), users })
  );
};