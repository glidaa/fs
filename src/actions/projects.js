import { API, graphqlOperation } from "@aws-amplify/api";
import { listOwnedProjects, listAssignedProjects, listWatchedProjects } from "../graphql/queries"
import * as appActions from "./app"
import * as mutationsActions from "./mutations"
import * as observersActions from "./observers"
import * as mutations from "../graphql/mutations"
import * as cacheController from "../controllers/cache"
import { OK, PENDING, AuthState } from "../constants";
import prepareProjectToBeSent from "../utils/prepareProjectToBeSent";
import generateMutationID from "../utils/generateMutationID";

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
    const dataToSend = prepareProjectToBeSent(projectState)
    dispatch(appActions.setProjectAddingStatus(PENDING))
    return API.graphql(graphqlOperation(mutations.createProject, { input: dataToSend }))
      .then((incoming) => {
        dispatch(createProject(incoming.data.createProject, OWNED))
        dispatch(appActions.handleSetProject(incoming.data.createProject.id))
        dispatch(appActions.handleSetLeftPanel(false))
        dispatch(appActions.handleSetProjectTitle(true))
        dispatch(appActions.setProjectAddingStatus(OK))
      }).catch((err) => {
        console.error(err)
        dispatch(appActions.setProjectAddingStatus(OK))
      })
  } else {
    dispatch(createProject(projectState, OWNED))
    dispatch(appActions.handleSetProject(null))
    return dispatch(appActions.handleSetProject(projectState.id))
  }
}

export const handleUpdateProject = (update) => (dispatch, getState) => {
  const { user, projects } = getState()
  const prevProjectState = {...projects[update.id]}
  const updateWithID = {id: prevProjectState.id, ...update };
  if (user.state === AuthState.SignedIn) {
    const mutationID = generateMutationID(user.data.username)
    dispatch(mutationsActions.addMutation(mutationID))
    dispatch(updateProject(updateWithID, OWNED))
    return API.graphql(graphqlOperation(mutations.updateProject, { input: { ...updateWithID, mutationID } }))
      .catch((err) => {
        console.error(err)
        return dispatch(updateProject(prevProjectState, OWNED))
      })
  } else {
    dispatch(updateProject(updateWithID, OWNED));
  }
}

export const handleRemoveProject = (projectState) => (dispatch, getState) => {
  const { user, app } = getState()
  if (app.selectedProject === projectState.id) {
    dispatch(appActions.handleSetProject(projectState.prevProject))
  }
  if (user.state === AuthState.SignedIn) {
    dispatch(removeProject(projectState.id, OWNED))
    return API.graphql(graphqlOperation(mutations.deleteProjectAndTasks, { projectID: projectState.id }))
      .catch((err) => {
        console.log(err)
        dispatch(createProject(projectState, OWNED))
      })
  } else {
    dispatch(removeProject(projectState.id, OWNED))
  }
}

export const handleFetchOwnedProjects = () => async (dispatch, getState) => {
  const { user } = getState()
  dispatch(appActions.handleSetProject(null))
  if (user.state === AuthState.SignedIn) {
    try {
      const res = await API.graphql(graphqlOperation(listOwnedProjects))
      dispatch(fetchProjects(res.data.listOwnedProjects.items, OWNED))
      return getState().projects
    } catch (err) {
      console.error(err)
    }
  } else {
    dispatch(fetchCachedProjects(cacheController.getProjects()))
    return getState().projects
  }
}

export const handleFetchAssignedProjects = () => async (dispatch, getState) => {
  const { user } = getState()
  dispatch(appActions.handleSetProject(null))
  if (user.state === AuthState.SignedIn) {
    try {
      const res = await API.graphql(graphqlOperation(listAssignedProjects))
      const fetchedAssignedProjects = res.data.listAssignedProjects.items
      dispatch(fetchProjects(fetchedAssignedProjects, ASSIGNED))
      for (const fetchedAssignedProject of fetchedAssignedProjects) {
        await dispatch(observersActions.handleSetProjectObservers(fetchedAssignedProject.id))
      }
      return getState().projects
    } catch(err) {
      console.error(err)
    }
  } else {
    dispatch(fetchProjects([], ASSIGNED))
    return getState().projects
  }
}

export const handleFetchWatchedProjects = () => async (dispatch, getState) => {
  const { user } = getState()
  dispatch(appActions.handleSetProject(null))
  if (user.state === AuthState.SignedIn) {
    try {
      const res = await API.graphql(graphqlOperation(listWatchedProjects))
      const fetchedWatchedProjects = res.data.listWatchedProjects.items
      dispatch(fetchProjects(fetchedWatchedProjects, WATCHED))
      for (const fetchedWatchedProject of fetchedWatchedProjects) {
        await dispatch(observersActions.handleSetProjectObservers(fetchedWatchedProject.id))
      }
      return getState().projects
    } catch(err) {
      console.error(err)
    }
  } else {
    dispatch(fetchProjects([], WATCHED))
    return getState().projects
  }
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