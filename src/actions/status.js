export const SET_NOTIFICATIONS_STATUS = "SET_NOTIFICATIONS_STATUS";
export const SET_PROJECTS_STATUS = "SET_PROJECTS_STATUS";
export const SET_TASKS_STATUS = "SET_TASKS_STATUS";
export const SET_ATTACHMENTS_STATUS = "SET_ATTACHMENTS_STATUS";
export const SET_COMMENTS_STATUS = "SET_COMMENTS_STATUS";
export const SET_HISTORY_STATUS = "SET_HISTORY_STATUS";

export const setNotificationsStatus = (status) => ({
  type: SET_NOTIFICATIONS_STATUS,
  status,
});

export const setProjectsStatus = (status) => ({
  type: SET_PROJECTS_STATUS,
  status,
});

export const setTasksStatus = (status) => ({
  type: SET_TASKS_STATUS,
  status,
});

export const setAttachmentsStatus = (status) => ({
  type: SET_ATTACHMENTS_STATUS,
  status,
});

export const setCommentsStatus = (status) => ({
  type: SET_COMMENTS_STATUS,
  status,
});

export const setHistoryStatus = (status) => ({
  type: SET_HISTORY_STATUS,
  status,
});
