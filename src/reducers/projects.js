import injectItemOrder from "../utils/injectItemOrder"
import removeItemOrder from "../utils/removeItemOrder"
import { CREATE_PROJECT, UPDATE_PROJECT, REMOVE_PROJECT, EMPTY_PROJECTS, FETCH_PROJECTS } from "../actions/projects"

const initProjectsState = {
  owned: {},
  assigned: {}
}

export default function (state = initProjectsState, action) {
  let stateClone = {...state}
  switch(action.type) {
    case CREATE_PROJECT:
      stateClone[action.scope] = injectItemOrder(
        stateClone[action.scope],
        action.projectState,
        action.projectState.prevProject,
        action.projectState.nextProject,
        "prevProject",
        "nextProject"
      )
      return {...stateClone,
        [action.scope]: {
          ...stateClone[action.scope],
          [action.projectState.id]: action.projectState
        }
      }
    case UPDATE_PROJECT:
      const { scope, update } = action
      if (update.prevProject !== undefined && update.nextProject !== undefined) {
        stateClone[scope] = removeItemOrder(
          stateClone[scope],
          stateClone[scope][update.id],
          "prevProject",
          "nextProject"
        )
        stateClone[scope] = injectItemOrder(
          stateClone[scope],
          stateClone[scope][update.id],
          update.prevProject,
          update.nextProject,
          "prevProject",
          "nextProject"
        )
      }
      return {...stateClone,
        [scope]: {
          ...stateClone[scope],
          [update.id]: {
            ...stateClone[scope][update.id],
            ...update
          }
        }
      }
    case REMOVE_PROJECT:
      stateClone[action.scope] = removeItemOrder(
        stateClone[action.scope],
        stateClone[action.scope][action.id],
        "prevProject",
        "nextProject"
      )
      delete stateClone[action.scope][action.id]
      return stateClone
    case EMPTY_PROJECTS:
      return {...initProjectsState}
    case FETCH_PROJECTS:
      const newState = {
        ...state,
        [action.scope]: {}
      }
      for (const project of action.projects) {
        newState[action.scope][project.id] = project
      }
      return newState
    default:
      return state
  }
}