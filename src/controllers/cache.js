import { AuthState } from "../constants";

const initCacheValue = {
  projects: {},
  tasks: {},
  comments: {},
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
  window.localStorage.setItem(
    "cachedData",
    JSON.stringify({
      ...initCacheValue,
      ...(isSigningIn && { localCache: { ...getCache() } }),
    })
  );
};

export const deleteLocalCache = () => {
  const cache = getCache();
  delete cache.localCache;
  window.localStorage.setItem("cachedData", JSON.stringify(cache));
};

export const getProjects = () => {
  return getCache().projects;
};

export const getTasksByProjectID = (projectID) => {
  return getCache().tasks[projectID] || {};
};

export const getCommentsByTaskID = (taskID) => {
  return getCache().comments[taskID] || {};
};

export const getUser = () => {
  return getCache().user;
};

export const getUsers = () => {
  return getCache().users;
};

export const setProjects = (projects) => {
  window.localStorage.setItem(
    "cachedData",
    JSON.stringify({ ...getCache(), projects })
  );
};

export const setTasksByProjectID = (projectID, tasks) => {
  window.localStorage.setItem(
    "cachedData",
    JSON.stringify({
      ...getCache(),
      tasks: { ...getCache().tasks, [projectID]: tasks },
    })
  );
};

export const setCommentsByTaskID = (taskID, comments) => {
  window.localStorage.setItem(
    "cachedData",
    JSON.stringify({
      ...getCache(),
      comments: { ...getCache().comments, [taskID]: comments },
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
