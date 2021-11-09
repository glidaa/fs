import { FETCH_PROJECTS, CREATE_PROJECT, UPDATE_PROJECT, REMOVE_PROJECT } from "../actions/projects"
import { FETCH_TASKS, CREATE_TASK, UPDATE_TASK, REMOVE_TASK } from "../actions/tasks"
import { FETCH_COMMENTS, CREATE_COMMENT, UPDATE_COMMENT, REMOVE_COMMENT } from "../actions/comments"
import { ADD_USERS } from "../actions/users"
import { SET_STATE, SET_DATA } from "../actions/user"
import * as cacheController from "../controllers/cache"
import filterObj from "../utils/filterObj"

export default store => next => action => {
  const {
    app: {
      selectedProject, 
      selectedTask
    }
  } = store.getState()
  let result = next(action)
  if (action.type === FETCH_PROJECTS || action.type === CREATE_PROJECT || action.type === UPDATE_PROJECT || action.type === REMOVE_PROJECT) {
    cacheController.setProjects(filterObj(store.getState().projects, x => x.isOwned || x.isAssigned || x.isWatched))
  } else if (action.type === FETCH_TASKS) {
    cacheController.setTasksByProjectID(action.projectID, store.getState().tasks)
  } else if (action.type === CREATE_TASK || action.type === UPDATE_TASK || action.type === REMOVE_TASK) {
    const tasks = store.getState().tasks
    const projectID = Object.values(tasks)?.[0]?.projectID || selectedProject
    if (projectID) {
      cacheController.setTasksByProjectID(projectID, tasks)
    }
  } else if (action.type === FETCH_COMMENTS) {
    cacheController.setCommentsByTaskID(action.taskID, store.getState().comments)
  } else if (action.type === CREATE_COMMENT || action.type === UPDATE_COMMENT || action.type === REMOVE_COMMENT) {
    const comments = store.getState().comments
    const taskID = Object.values(comments)?.[0]?.taskID || selectedTask
    if (taskID) {
      cacheController.setCommentsByTaskID(taskID, comments)
    }
  } else if (action.type === ADD_USERS) {
    cacheController.setUsers(store.getState().users)
  } else if (action.type === SET_STATE || action.type === SET_DATA) {
    cacheController.setUser(store.getState().user)
  }
  return result
}