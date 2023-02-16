import {
  IMPORT_APP_SETTINGS,
  SET_THEME,
  SET_TASKS_SORTING_CRITERIA,
  SET_IS_DARK_MODE,
  SET_SHOW_DUE_DATE,
  SET_SHOW_ASSIGNEES,
  SET_SHOW_DONE_INDICATOR,
  SET_SHOW_DUPLICATE_BUTTON,
  SET_SHOW_COPY_BUTTON,
  SET_SHOW_SHARE_BUTTON,
} from "../actions/appSettings";

const defaultState = {
  theme: "blue",
  isDarkMode: false,
  tasksSortingCriteria: "BY_DEFAULT",
  showDueDate: true,
  showAssignees: true,
  showDoneIndicator: true,
  showCopyButton: true,
  showDuplicateButton: true,
  showShareButton: true,
};

const cachedState = JSON.parse(window.localStorage.getItem("appSettings"));

const initState = { ...defaultState, ...(cachedState || {}) }

window.localStorage.setItem("appSettings", JSON.stringify(initState));

const appSettingsReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_THEME:
      return { ...state, theme: action.theme };
    case SET_IS_DARK_MODE:
      return { ...state, isDarkMode: action.isDarkMode };
    case SET_TASKS_SORTING_CRITERIA:
      return { ...state, tasksSortingCriteria: action.criteria };
    case SET_SHOW_DUE_DATE:
      return { ...state, showDueDate: action.nextState };
    case SET_SHOW_ASSIGNEES:
      return { ...state, showAssignees: action.nextState };
    case SET_SHOW_DONE_INDICATOR:
      return { ...state, showDoneIndicator: action.nextState };
    case SET_SHOW_COPY_BUTTON:
      return { ...state, showCopyButton: action.nextState };
    case SET_SHOW_DUPLICATE_BUTTON:
      return { ...state, showDuplicateButton: action.nextState };
    case SET_SHOW_SHARE_BUTTON:
      return { ...state, showShareButton: action.nextState };
    case IMPORT_APP_SETTINGS:
      return { ...state, ...action.settings };
    default:
      return state;
  }
}

export default appSettingsReducer;
