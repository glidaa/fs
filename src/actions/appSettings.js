export const SET_THEME = "SET_THEME";
export const SET_IS_DARK_MODE = "SET_IS_DARK_MODE";
export const SET_TASKS_SORTING_CRITERIA = "SET_TASKS_SORTING_CRITERIA";
export const SET_SHOW_DUE_DATE = "SET_SHOW_DUE_DATE";
export const SET_SHOW_ASSIGNEES = "SET_SHOW_ASSIGNEES";
export const SET_SHOW_DONE_INDICATOR = "SET_SHOW_DONE_INDICATOR";
export const SET_SHOW_COPY_BUTTON = "SET_SHOW_COPY_BUTTON";
export const SET_SHOW_DUPLICATE_BUTTON = "SET_SHOW_DUPLICATE_BUTTON";
export const SET_SHOW_SHARE_BUTTON = "SET_SHOW_SHARE_BUTTON";
export const IMPORT_APP_SETTINGS = "IMPORT_APP_SETTINGS";

const setTheme = (theme) => ({
  type: SET_THEME,
  theme
});

const setIsDarkMode = (isDarkMode) => ({
  type: SET_IS_DARK_MODE,
  isDarkMode
});

const setTasksSortingCriteria = (criteria) => ({
  type: SET_TASKS_SORTING_CRITERIA,
  criteria
});

const setShowDueDate = (nextState) => ({
  type: SET_SHOW_DUE_DATE,
  nextState
});

const setShowAssignees = (nextState) => ({
  type: SET_SHOW_ASSIGNEES,
  nextState
});

const setShowDoneIndicator = (nextState) => ({
  type: SET_SHOW_DONE_INDICATOR,
  nextState
});

const setShowCopyButton = (nextState) => ({
  type: SET_SHOW_COPY_BUTTON,
  nextState
});

const setShowDuplicateButton = (nextState) => ({
  type: SET_SHOW_DUPLICATE_BUTTON,
  nextState
});

const setShowShareButton = (nextState) => ({
  type: SET_SHOW_SHARE_BUTTON,
  nextState
});

export const importAppSettings = (settings) => ({
  type: IMPORT_APP_SETTINGS,
  settings
});

export const handleSetTheme = (theme) => (dispatch, getState) => {
  const prevAppSettings = getState().appSettings
  const nextAppSettings = {
    ...prevAppSettings,
    theme: theme
  }
  window.localStorage.setItem("appSettings", JSON.stringify(nextAppSettings))
  return dispatch(setTheme(theme))
}

export const handleSetIsDarkMode = (isDarkMode) => (dispatch, getState) => {
  const prevAppSettings = getState().appSettings
  const nextAppSettings = {
    ...prevAppSettings,
    isDarkMode: isDarkMode
  }
  window.localStorage.setItem("appSettings", JSON.stringify(nextAppSettings))
  return dispatch(setIsDarkMode(isDarkMode))
}

export const handleSetTasksSortingCriteria = (criteria) => (dispatch, getState) => {
  const prevAppSettings = getState().appSettings
  const nextAppSettings = {
    ...prevAppSettings,
    tasksSortingCriteria: criteria
  }
  window.localStorage.setItem("appSettings", JSON.stringify(nextAppSettings))
  return dispatch(setTasksSortingCriteria(criteria))
}

export const handleSetShowDueDate = (nextState) => (dispatch, getState) => {
  const prevAppSettings = getState().appSettings
  const nextAppSettings = {
    ...prevAppSettings,
    showDueDate: nextState
  }
  window.localStorage.setItem("appSettings", JSON.stringify(nextAppSettings))
  return dispatch(setShowDueDate(nextState))
}

export const handleSetShowAssignees = (nextState) => (dispatch, getState) => {
  const prevAppSettings = getState().appSettings
  const nextAppSettings = {
    ...prevAppSettings,
    showAssignees: nextState
  }
  window.localStorage.setItem("appSettings", JSON.stringify(nextAppSettings))
  return dispatch(setShowAssignees(nextState))
}

export const handleSetShowDoneIndicator = (nextState) => (dispatch, getState) => {
  const prevAppSettings = getState().appSettings
  const nextAppSettings = {
    ...prevAppSettings,
    showDoneIndicator: nextState
  }
  window.localStorage.setItem("appSettings", JSON.stringify(nextAppSettings))
  return dispatch(setShowDoneIndicator(nextState))
}

export const handleSetShowCopyButton = (nextState) => (dispatch, getState) => {
  const prevAppSettings = getState().appSettings
  const nextAppSettings = {
    ...prevAppSettings,
    showCopyButton: nextState
  }
  window.localStorage.setItem("appSettings", JSON.stringify(nextAppSettings))
  return dispatch(setShowCopyButton(nextState))
}

export const handleSetShowDuplicateButton = (nextState) => (dispatch, getState) => {
  const prevAppSettings = getState().appSettings
  const nextAppSettings = {
    ...prevAppSettings,
    showDuplicateButton: nextState
  }
  window.localStorage.setItem("appSettings", JSON.stringify(nextAppSettings))
  return dispatch(setShowDuplicateButton(nextState))
}

export const handleSetShowShareButton = (nextState) => (dispatch, getState) => {
  const prevAppSettings = getState().appSettings
  const nextAppSettings = {
    ...prevAppSettings,
    showShareButton: nextState
  }
  window.localStorage.setItem("appSettings", JSON.stringify(nextAppSettings))
  return dispatch(setShowShareButton(nextState))
}