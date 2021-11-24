import { graphqlOperation } from "@aws-amplify/api";
import { listOwnedProjects, listAssignedProjects, listWatchedProjects } from "../graphql/queries"
import * as appActions from "./app"
import * as mutationsActions from "./mutations"
import * as observersActions from "./observers"
import * as mutations from "../graphql/mutations"
import * as cacheController from "../controllers/cache"
import { OK, PENDING, AuthState } from "../constants";
import prepareProjectToBeSent from "../utils/prepareProjectToBeSent";
import generateID from "../utils/generateID";
import execGraphQL from "../utils/execGraphQL";

export const CREATE_PROJECT = "CREATE_PROJECT";
export const UPDATE_PROJECT = "UPDATE_PROJECT";
export const REMOVE_PROJECT = "REMOVE_PROJECT";
export const EMPTY_PROJECTS = "EMPTY_PROJECTS";
export const FETCH_PROJECTS = "FETCH_PROJECTS";
export const FETCH_CACHED_PROJECTS = "FETCH_CACHED_PROJECTS";

const OWNED = "owned"
const ASSIGNED = "assigned"
const WATCHED = "watched"

export const createProject = (projectState, scope) => ({
  type: CREATE_PROJECT,
  projectState,
  scope
});

export const updateProject = (update, scope) => ({
  type: UPDATE_PROJECT,
  update,
  scope
});

export const removeProject = (id, scope) => ({
  type: REMOVE_PROJECT,
  id,
  scope
});

export const emptyProjects = () => ({
  type: EMPTY_PROJECTS
});

const fetchProjects = (projects, scope) => ({
  type: FETCH_PROJECTS,
  projects,
  scope
});

const fetchCachedProjects = (projects) => ({
  type: FETCH_CACHED_PROJECTS,
  projects
});

export const handleCreateProject = (projectState) => (dispatch, getState) => {
  const { user } = getState()
  if (user.state === AuthState.SignedIn) {
    dispatch(createProject({
      ...projectState,
      permalink: user.data.username + "/" + projectState.permalink,
      owner: user.data.username,
      isVirtual: true
    }, OWNED))
    dispatch(appActions.handleSetProject(projectState.id))
    dispatch(appActions.handleSetLeftPanel(false))
    dispatch(appActions.handleSetProjectTitle(true))
    const dataToSend = prepareProjectToBeSent(projectState)
    dispatch(mutationsActions.scheduleMutation(
      "createProject",
      dataToSend,
      (incoming) => {
        dispatch(updateProject({
          ...incoming.data.createProject,
          isVirtual: false
        }))
        if (getState().app.selectedProject === projectState.id) {
          dispatch(observersActions.handleSetTasksObservers(projectState.id))
        }
      },
      () => {
        if (getState().app.selectedProject === projectState.id) {
          dispatch(appActions.handleSetProject(null))
        }
        dispatch(removeProject(projectState.id))
      }
    ))
  } else {
    dispatch(createProject(projectState, OWNED))
    dispatch(appActions.handleSetProject(null))
    return dispatch(appActions.handleSetProject(projectState.id))
  }
}

export const handleUpdateProject = (update) => (dispatch, getState) => {
  const { app, user, projects } = getState()
  const prevProjectState = {...projects[update.id]}
  dispatch(updateProject(update, OWNED))
  if (app.selectedProject === update.id && update.permalink !== prevProjectState.permalink) {
    app?.navigate("/" + (user.state !== AuthState.SignedIn ? "local/" : "") + update.permalink, { replace: true })
  }
  if (user.state === AuthState.SignedIn) {
    return dispatch(mutationsActions.scheduleMutation(
      "updateProject",
      update,
      null,
      () => {
        if (getState().projects[update.id]) {
          dispatch(updateProject(prevProjectState))
          if (getState().app.selectedProject === update.id && update.permalink !== prevProjectState.permalink) {
            app?.navigate("/" + prevProjectState.permalink, { replace: true })
          }
        }
      }
    ))
  }
}

export const handleRemoveProject = (projectState) => (dispatch, getState) => {
  const { user, app } = getState()
  if (app.selectedProject === projectState.id) {
    dispatch(appActions.handleSetProject(projectState.prevProject))
  }
  dispatch(removeProject(projectState.id, OWNED))
  if (user.state === AuthState.SignedIn) {
    return dispatch(mutationsActions.scheduleMutation(
      "deleteProjectAndTasks",
      { id: projectState.id },
      null,
      () => {
        dispatch(createProject(projectState, OWNED))
      }
    ))
  }
}

export const handleFetchOwnedProjects = (isSync = false) => async (dispatch, getState) => {
  const { user } = getState()
  // if (!isSync) dispatch(appActions.handleSetProject(null))
  if (user.state === AuthState.SignedIn) {
    try {
      const res = await execGraphQL(graphqlOperation(listOwnedProjects))
      dispatch(fetchProjects(res.data.listOwnedProjects.items, OWNED))
    } catch (err) {
      if (err.errors[0].message === 'Network Error') {
        dispatch(fetchCachedProjects(cacheController.getProjects()))
      }
    }
  } else {
    dispatch(fetchCachedProjects(cacheController.getProjects()))
  }
  return getState().projects
}

export const handleFetchAssignedProjects = (isSync = false) => async (dispatch, getState) => {
  const { user } = getState()
  // if (!isSync) dispatch(appActions.handleSetProject(null))
  if (user.state === AuthState.SignedIn) {
    try {
      const res = await execGraphQL(graphqlOperation(listAssignedProjects))
      const fetchedAssignedProjects = res.data.listAssignedProjects.items
      dispatch(fetchProjects(fetchedAssignedProjects, ASSIGNED))
      for (const fetchedAssignedProject of fetchedAssignedProjects) {
        await dispatch(observersActions.handleSetProjectObservers(fetchedAssignedProject.id))
      }
    } catch(err) {
      if (err.errors.message === 'Network Error') {
        dispatch(fetchCachedProjects(cacheController.getProjects()))
      }
    }
  } else {
    dispatch(fetchProjects([], ASSIGNED))
  }
  return getState().projects
}

export const handleFetchWatchedProjects = (isSync = false) => async (dispatch, getState) => {
  const { user } = getState()
  // if (!isSync) dispatch(appActions.handleSetProject(null))
  if (user.state === AuthState.SignedIn) {
    try {
      const res = await execGraphQL(graphqlOperation(listWatchedProjects))
      const fetchedWatchedProjects = res.data.listWatchedProjects.items
      dispatch(fetchProjects(fetchedWatchedProjects, WATCHED))
      for (const fetchedWatchedProject of fetchedWatchedProjects) {
        await dispatch(observersActions.handleSetProjectObservers(fetchedWatchedProject.id))
      }
    } catch(err) {
      if (err.errors.message === 'Network Error') {
        dispatch(fetchCachedProjects(cacheController.getProjects()))
      }
    }
  } else {
    dispatch(fetchProjects([], WATCHED))
  }
  return getState().projects
}

export const handleUpdateTaskCount = (projectID, prevStatus, nextStatus) => (dispatch, getState) => {
  const { projects } = getState()
  const prevProjectState = {...projects[projectID]}
  const prevTodoCount = prevProjectState.todoCount
  const prevPendingCount = prevProjectState.pendingCount
  const prevDoneCount = prevProjectState.doneCount
  const todoCountInc = (prevStatus === "todo" ? -1 : 0) || (nextStatus === "todo" ? 1 : 0)
  const pendingCountInc = (prevStatus === "pending" ? -1 : 0) || (nextStatus === "pending" ? 1 : 0)
  const doneCountInc = (prevStatus === "done" ? -1 : 0) || (nextStatus === "done" ? 1 : 0)
  const update = {
    id: projectID,
    todoCount: prevTodoCount + todoCountInc,
    pendingCount: prevPendingCount + pendingCountInc,
    doneCount: prevDoneCount + doneCountInc
  }
  dispatch(updateProject(update, OWNED));
}