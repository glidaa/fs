import { listOwnedProjects, listAssignedProjects, listWatchedProjects } from "../graphql/queries"
import * as appActions from "./app"
import * as statusActions from "./status"
import * as cacheController from "../controllers/cache"
import { AuthState, ThingStatus } from "../constants";
import prepareProjectToBeSent from "../utils/prepareProjectToBeSent";
import { navigate } from "../components/Router"
import API from "../amplify/API"
import PubSub from "../amplify/PubSub";
import { getPreviousItem } from "../utils/getAdjacentItem";
import sortByRank from "../utils/sortByRank";
import filterObj from "../utils/filterObj";

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
      permalink: projectState.permalink,
      owner: user.data.username,
      isVirtual: true
    }, OWNED))
    dispatch(appActions.handleSetProject(projectState.id))
    dispatch(appActions.handleSetProjectTitle(true))
    const dataToSend = prepareProjectToBeSent(projectState)
    API.mutate({
      type: "createProject",
      variables: dataToSend,
      success: (incoming) => {
        dispatch(updateProject({
          id: incoming.data.createProject.id,
          isVirtual: false
        }))
        if (getState().app.selectedProject === projectState.id) {
          PubSub.subscribeTopic("tasks", incoming.data.createProject.id)
        }
      },
      error: () => {
        if (getState().app.selectedProject === projectState.id) {
          dispatch(appActions.handleSetProject(null))
        }
        dispatch(removeProject(projectState.id))
      }
    })
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
  if (app.selectedProject === update.id && Object.prototype.hasOwnProperty.call(update, "permalink")) {
    navigate("/" + (user.state === AuthState.SignedIn ? user.data.username + "/" : "local/") + update.permalink, true)
  }
  if (user.state === AuthState.SignedIn) {
    return API.mutate({
      type: "updateProject",
      variables: update,
      success: null,
      error: () => {
        if (getState().projects[update.id]) {
          dispatch(updateProject(prevProjectState))
          if (getState().app.selectedProject === update.id && Object.prototype.hasOwnProperty.call(update, "permalink")) {
            navigate("/" + prevProjectState.permalink, true)
          }
        }
      }
    })
  }
}

export const handleUpdateProjectTitle = (update) => (dispatch, getState) => {
  const { user, projects } = getState()
  const prevProjectState = {...projects[update.id]}
  dispatch(updateProject(update, OWNED))
  if (user.state === AuthState.SignedIn) {
    return API.mutate({
      type: "updateProjectTitle",
      variables: update,
      success: null,
      error: () => {
        if (getState().projects[update.id]) {
          dispatch(updateProject(prevProjectState))
        }
      }
    })
  }
}

export const handleRemoveProject = (projectState) => (dispatch, getState) => {
  const { user, app, projects } = getState()
  if (app.selectedProject === projectState.id) {
    const sortedOwnedProjects = sortByRank(filterObj(projects, x => x.isOwned));
    const sortedAssignedProjects = sortByRank(filterObj(projects, x => x.isAssigned));
    const sortedWatchedProjects = sortByRank(filterObj(projects, x => x.isWatched));
    const previousItem = projectState.isOwned && sortedOwnedProjects.length > 1
      ? getPreviousItem(sortedOwnedProjects, projectState)
      : projectState.isAssigned && sortedAssignedProjects.length > 1
      ? getPreviousItem(sortedAssignedProjects, projectState)
      : projectState.isWatched && sortedWatchedProjects.length > 1
      ? getPreviousItem(sortedWatchedProjects, projectState)
      : !projectState.isOwned && sortedOwnedProjects.length
      ? sortedOwnedProjects[0]
      : !projectState.isAssigned && sortedAssignedProjects.length
      ? sortedAssignedProjects[0]
      : !projectState.isWatched && sortedWatchedProjects.length
      ? sortedWatchedProjects[0]
      : null;
    dispatch(appActions.handleSetProject(previousItem?.id))
  }
  dispatch(removeProject(projectState.id, OWNED))
  if (user.state === AuthState.SignedIn) {
    return API.mutate({
      type: "deleteProjectAndTasks",
      variables: { id: projectState.id },
      success: null,
      error: () => {
        dispatch(createProject(projectState, OWNED))
      }
    })
  }
}

export const handleFetchOwnedProjects = (isSync = false) => async (dispatch, getState) => {
  dispatch(statusActions.setProjectsStatus(ThingStatus.FETCHING))
  const { user } = getState()
  // if (!isSync) dispatch(appActions.handleSetProject(null))
  if (user.state === AuthState.SignedIn) {
    try {
      const res = await API.execute(listOwnedProjects)
      dispatch(fetchProjects(res.data.listOwnedProjects.items, OWNED))
      dispatch(statusActions.setProjectsStatus(ThingStatus.READY))
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        dispatch(fetchCachedProjects(cacheController.getProjects()))
        dispatch(statusActions.setProjectsStatus(ThingStatus.READY))
      } else {
        dispatch(statusActions.setProjectsStatus(ThingStatus.ERROR))
      }
    }
  } else {
    dispatch(fetchCachedProjects(cacheController.getProjects()))
    dispatch(statusActions.setProjectsStatus(ThingStatus.READY))
  }
  return getState().projects
}

export const handleFetchAssignedProjects = (isSync = false) => async (dispatch, getState) => {
  const { user } = getState()
  // if (!isSync) dispatch(appActions.handleSetProject(null))
  if (user.state === AuthState.SignedIn) {
    try {
      const res = await API.execute(listAssignedProjects)
      const fetchedAssignedProjects = res.data.listAssignedProjects.items
      dispatch(fetchProjects(fetchedAssignedProjects, ASSIGNED))
      for (const fetchedAssignedProject of fetchedAssignedProjects) {
        PubSub.subscribeTopic("project", fetchedAssignedProject.id)
      }
    } catch(err) {
      if (err.message === 'Failed to fetch') {
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
      const res = await API.execute(listWatchedProjects)
      const fetchedWatchedProjects = res.data.listWatchedProjects.items
      dispatch(fetchProjects(fetchedWatchedProjects, WATCHED))
      for (const fetchedWatchedProject of fetchedWatchedProjects) {
        PubSub.subscribeTopic("project", fetchedWatchedProject.id)
      }
    } catch(err) {
      if (err.message === 'Failed to fetch') {
        dispatch(fetchCachedProjects(cacheController.getProjects()))
      }
    }
  } else {
    dispatch(fetchProjects([], WATCHED))
  }
  return getState().projects
}