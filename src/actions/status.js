export const SET_PROJECTS_STATUS = "SET_PROJECTS_STATUS";
export const SET_TASKS_STATUS = "SET_TASKS_STATUS";
export const SET_COMMENTS_STATUS = "SET_COMMENTS_STATUS";

export const setProjectsStatus = (status) => ({
  type: SET_PROJECTS_STATUS,
  status
})

export const setTasksStatus = (status) => ({
  type: SET_TASKS_STATUS,
  status
})

export const setCommentsStatus = (status) => ({
  type: SET_COMMENTS_STATUS,
  status
})