import { API, graphqlOperation } from "aws-amplify";
import { AuthState } from '@aws-amplify/ui-components';
import { listOwnedProjects, listAssignedProjects } from "../graphql/queries"
import * as appActions from "./app"
import * as mutations from "../graphql/mutations"
import injectItemOrder from "../utils/injectItemOrder"
import removeItemOrder from "../utils/removeItemOrder"
import { OK, PENDING } from "../constants";
import prepareProjectToBeSent from "../utils/prepareProjectToBeSent";

export const CREATE_PROJECT = "CREATE_PROJECT";
export const UPDATE_PROJECT = "UPDATE_PROJECT";
export const REMOVE_PROJECT = "REMOVE_PROJECT";
export const EMPTY_PROJECTS = "EMPTY_PROJECTS";
export const FETCH_PROJECTS = "FETCH_PROJECTS";

const OWNED = "owned"
const ASSIGNED = "assigned"

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

export const handleCreateProject = (projectState) => (dispatch, getState) => {
  const { user } = getState()
  if (user.state === AuthState.SignedIn) {
    const dataToSend = prepareProjectToBeSent(projectState)
    dispatch(appActions.setProjectAddingStatus(PENDING))
    return API.graphql(graphqlOperation(mutations.createProject, { input: dataToSend }))
      .then((incoming) => {
        dispatch(createProject(incoming.data.createProject, OWNED))
        dispatch(appActions.handleSetProject(null))
        dispatch(appActions.handleSetProject(incoming.data.createProject.id))
        dispatch(appActions.setProjectAddingStatus(OK))
      }).catch((err) => {
        console.error(err)
        dispatch(appActions.setProjectAddingStatus(OK))
      })
  } else {
    dispatch(createProject(projectState, OWNED))
    let localProjects = JSON.parse(window.localStorage.getItem("projects")) || {}
    localProjects = injectItemOrder(
      localProjects,
      projectState,
      projectState.prevProject,
      projectState.nextProject,
      "prevProject",
      "nextProject"
    )
    localProjects[projectState.id] = {
      ...projectState,
      tasks: []
    }
    window.localStorage.setItem("projects", JSON.stringify(localProjects))
    dispatch(appActions.handleSetProject(null))
    return dispatch(appActions.handleSetProject(projectState.id))
  }
}

export const handleUpdateProject = (update) => (dispatch, getState) => {
  const { user, projects } = getState()
  const prevProjectState = {...projects[OWNED][update.id]}
  const updateWithID = {id: prevProjectState.id, ...update };
  if (user.state === AuthState.SignedIn) {
    dispatch(updateProject(updateWithID, OWNED))
    return API.graphql(graphqlOperation(mutations.updateProject, { input: updateWithID }))
      .catch(() => {
        return dispatch(updateProject(prevProjectState, OWNED))
      })
  } else {
    dispatch(updateProject(updateWithID, OWNED));
    let localProjects = JSON.parse(window.localStorage.getItem("projects"))
    if (update.prevProject !== undefined && update.nextProject !== undefined) {
      localProjects = removeItemOrder(
        localProjects,
        localProjects[update.id],
        "prevProject",
        "nextProject"
      )
      localProjects = injectItemOrder(
        localProjects,
        localProjects[update.id],
        update.prevProject,
        update.nextProject,
        "prevProject",
        "nextProject"
      )
    }
    localProjects = {
      ...localProjects,
      [prevProjectState.id]: {
        ...localProjects[prevProjectState.id],
        ...update
      }
    }
    return window.localStorage.setItem("projects", JSON.stringify(localProjects))
  }
}

export const handleRemoveProject = (projectState) => (dispatch, getState) => {
  const { user, app } = getState()
  if (app.selectedProject === projectState.id) {
    dispatch(appActions.handleSetProject(null))
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
    let localProjects = JSON.parse(window.localStorage.getItem("projects"))
    localProjects = removeItemOrder(
      localProjects,
      localProjects[projectState.id],
      "prevProject",
      "nextProject"
    )
    delete localProjects[projectState.id]
    return window.localStorage.setItem("projects", JSON.stringify(localProjects))
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
    let localProjects = JSON.parse(window.localStorage.getItem("projects"))
    if (localProjects) {
      localProjects = Object.values(localProjects)
      localProjects = localProjects.map(project => {
        delete project.tasks
        return project
      })
      dispatch(fetchProjects(localProjects, OWNED))
    } else {
      dispatch(fetchProjects([], OWNED))
    }
    return getState().projects
  }
}

export const handleFetchAssignedProjects = () => async (dispatch, getState) => {
  const { user } = getState()
  dispatch(appActions.handleSetProject(null))
  if (user.state === AuthState.SignedIn) {
    try {
      const res = await API.graphql(graphqlOperation(listAssignedProjects))
      dispatch(fetchProjects(res.data.listAssignedProjects.items, ASSIGNED))
      return getState().projects
    } catch(err) {
      console.error(err)
    }
  } else {
    dispatch(fetchProjects([], ASSIGNED))
    return getState().projects
  }
}