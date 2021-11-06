export const SET_THEME = "SET_THEME";
export const SET_IS_DARK_MODE = "SET_IS_DARK_MODE";
export const SET_TASKS_SORTING_CRITERIA = "SET_TASKS_SORTING_CRITERIA";
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