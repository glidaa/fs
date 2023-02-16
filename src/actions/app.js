import { panelPages, AuthState } from "../constants"
import * as tasksActions from "./tasks"
import * as commentsActions from "./comments"
import * as attachmentsActions from "./attachments"
import * as historyActions from "./history"
import { clearTabs } from "../components/TabViewManager"
import { navigate } from "../components/Router"
import PubSub from "../amplify/PubSub"

export const SET_PROJECT = "SET_PROJECT";
export const SET_TASK = "SET_TASK";
export const BATCH_SELECT_TASK = "BATCH_SELECT_TASK";
export const BATCH_DESELECT_TASK = "BATCH_DESELECT_TASK";
export const SET_OFFLINE = "SET_OFFLINE";
export const SET_SYNCED = "SET_SYNCED";
export const SET_LEFT_PANEL = "SET_LEFT_PANEL";
export const SET_RIGHT_PANEL = "SET_RIGHT_PANEL";
export const SET_PROJECT_TITLE = "SET_PROJECT_TITLE";
export const SET_LOCKED_TASK_FIELD = "SET_LOCKED_TASK_FIELD";
export const SET_RIGHT_PANEL_PAGE = "SET_RIGHT_PANEL_PAGE";
export const SET_LEFT_PANEL_PAGE = "SET_LEFT_PANEL_PAGE";

const setProject = (id) => ({
  type: SET_PROJECT,
  id
});

const setTask = (id) => ({
  type: SET_TASK,
  id
});

const batchSelectTask = (id) => ({
  type: BATCH_SELECT_TASK,
  id
});

const batchDeselectTask = (id) => ({
  type: BATCH_DESELECT_TASK,
  id
});

const setProjectTitle = (status) => ({
  type: SET_PROJECT_TITLE,
  status
});

const setLeftPanel = (status) => ({
  type: SET_LEFT_PANEL,
  status
});

const setRightPanel = (status) => ({
  type: SET_RIGHT_PANEL,
  status
});

export const setOffline = (isOffline) => ({
  type: SET_OFFLINE,
  isOffline
});

export const setSynced = (isSynced) => ({
  type: SET_SYNCED,
  isSynced
});

export const setRightPanelPage = (page) => ({
  type: SET_RIGHT_PANEL_PAGE,
  page
});

export const setLeftPanelPage = (page) => ({
  type: SET_LEFT_PANEL_PAGE,
  page
});

export const setLockedTaskField = (fieldName) => ({
  type: SET_LOCKED_TASK_FIELD,
  fieldName
});

export const handleSetProject = (id, shouldChangeURL = true) => (dispatch, getState) => {
  const { user, app, projects } = getState()
  if (app.selectedProject !== id) {
    PubSub.unsubscribeTopic("tasks");
    dispatch(handleSetTask(null, shouldChangeURL));
    dispatch(tasksActions.emptyTasks());
    if (id) {
      if (projects[id]) {
        dispatch(setProject(id))
        if (shouldChangeURL) {
          if (user.state === AuthState.SignedIn || projects[id].isTemp) {
            navigate(`/${projects[id].owner}/${projects[id].permalink}`)
          } else {
            navigate(`/local/${projects[id].permalink}`)
          }
        }
      }
      if (!getState().projects[id].isVirtual) {
        dispatch(tasksActions.handleFetchTasks(id))
        if (user.state === AuthState.SignedIn || projects[id].isTemp) {
          PubSub.subscribeTopic("tasks", id)
        }
      }
    } else {
      if (shouldChangeURL) {
        navigate("/")
      }
      dispatch(setProject(null))
    }
    if (shouldChangeURL) {
      clearTabs();
      dispatch(setRightPanel(false));
      dispatch(setLeftPanel(false));
      dispatch(setRightPanelPage(null));
      dispatch(setLeftPanelPage(null));
    }
  }
}

export const handleSetTask = (id, shouldChangeURL = true) => (dispatch, getState) => {
  const { user, projects, tasks, app } = getState()
  dispatch(attachmentsActions.emptyAttachments())
  dispatch(historyActions.emptyHistory())
  PubSub.unsubscribeTopic("comments")
  dispatch(commentsActions.emptyComments())
  dispatch(setProjectTitle(false))
  if (!id && app.selectedTask) {
    if (app.isRightPanelOpened) {
      dispatch(setRightPanel(false))
    }
    if (shouldChangeURL) {
      if (app.selectedProject && (user.state === AuthState.SignedIn || projects[app.selectedProject].isTemp)) {
        navigate(`/${projects[app.selectedProject].owner}/${projects[app.selectedProject].permalink}`)
      }
    }
    dispatch(setTask(null))
  } else if (!id) {
    if (app.isRightPanelOpened) {
      dispatch(setRightPanel(false))
    }
    dispatch(setTask(null))
  } else {
    if (app.selectedTask && app.isRightPanelOpened && app.rightPanelPage !== panelPages.TASK_HUB) {
      dispatch(setRightPanelPage(panelPages.TASK_HUB))
    }
    if (shouldChangeURL) {
      if (app.selectedProject && (user.state === AuthState.SignedIn || projects[app.selectedProject].isTemp)) {
        navigate(`/${projects[app.selectedProject].owner}/${projects[app.selectedProject].permalink}/${tasks[id].permalink}`)
      }
    }
    dispatch(setTask(id))
    dispatch(setLockedTaskField(null))
    if (!tasks[id].isVirtual) {
      dispatch(attachmentsActions.handleFetchAttachments(id))
      dispatch(historyActions.handleFetchHistory(id))
      dispatch(commentsActions.handleFetchComments(id))
      if (user.state === AuthState.SignedIn) {
        PubSub.subscribeTopic("comments", id)
      }
    }
  }
}

export const handleBatchSelectTask = (id) => (dispatch, getState) => {
  const { app } = getState();
  if (app.selectedTask) {
    const isRightPanelOpened = app.isRightPanelOpened;
    dispatch(handleSetTask(null));
    if (isRightPanelOpened) {
      dispatch(setRightPanel(true));
      dispatch(setRightPanelPage(panelPages.BATCH_HUB));
    }
  }
  dispatch(batchSelectTask(id));
};

export const handleBatchDeselectTask = (id) => (dispatch, getState) => {
  const { app } = getState();
  if (app.selectedTasks?.length === 1) {
    const isRightPanelOpened = app.isRightPanelOpened;
    dispatch(handleSetTask(app.selectedTasks[0]));
    if (isRightPanelOpened) {
      dispatch(setRightPanel(true));
      dispatch(setRightPanelPage(panelPages.TASK_HUB));
    }
  }
  dispatch(batchDeselectTask(id));
};

export const handleSetProjectTitle = (status) => (dispatch) => {
  if (status) {
    dispatch(handleSetTask(null))
  }
  return dispatch(setProjectTitle(status))
}

export const handleSetRightPanel = (status) => (dispatch, getState) => {
  const { app: { isLeftPanelOpened } } = getState()
  if (status && isLeftPanelOpened) {
    dispatch(setLeftPanel(false))
  }
  return dispatch(setRightPanel(status))
}

export const handleSetLeftPanel = (status) => (dispatch, getState) => {
  const { app: { isRightPanelOpened } } = getState()
  if (status && isRightPanelOpened) {
    dispatch(setRightPanel(false))
  }
  return dispatch(setLeftPanel(status))
}