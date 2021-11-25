import injectItemOrder from "../utils/injectItemOrder"
import removeItemOrder from "../utils/removeItemOrder"
import { CREATE_PROJECT, UPDATE_PROJECT, REMOVE_PROJECT, EMPTY_PROJECTS, FETCH_PROJECTS, FETCH_CACHED_PROJECTS } from "../actions/projects"
import filterObj from "../utils/filterObj"

export default function (state = {}, action) {
  let stateClone = {...state}
  switch(action.type) {
    case CREATE_PROJECT:
      if (action.scope === "owned") {
        stateClone = injectItemOrder(
          stateClone,
          action.projectState,
          action.projectState.prevProject,
          action.projectState.nextProject,
          "prevProject",
          "nextProject"
        )
      }
      return {
        ...stateClone,
        [action.projectState.id]: {
          ...action.projectState,
          isOwned: stateClone[action.projectState.id]?.isOwned || action.scope === "owned",
          isAssigned: stateClone[action.projectState.id]?.isAssigned || action.scope === "assigned",
          isWatched: stateClone[action.projectState.id]?.isWatched || action.scope === "watched",
          isTemp: stateClone[action.projectState.id]?.isTemp || action.scope === "temp"
        }
      }
    case UPDATE_PROJECT:
      const update = Object.fromEntries(Object.entries(action.update).filter(item => item[1] != null))
      if (update.prevProject && update.nextProject) {
        stateClone = removeItemOrder(
          stateClone,
          stateClone[update.id],
          "prevProject",
          "nextProject"
        )
        stateClone = injectItemOrder(
          stateClone,
          stateClone[update.id],
          update.prevProject,
          update.nextProject,
          "prevProject",
          "nextProject"
        )
      }
      return {
        ...stateClone,
        [update.id]: {
          ...stateClone[update.id],
          ...update
        }
      }
    case REMOVE_PROJECT:
      if (action.scope === "owned") {
        stateClone = removeItemOrder(
          stateClone,
          stateClone[action.id],
          "prevProject",
          "nextProject"
        )
      }
      if ((action.scope === "owned" && !stateClone[action.id].isAssigned && !stateClone[action.id].isWatched && !stateClone[action.id].isTemp) ||
          (action.scope === "assigned" && !stateClone[action.id].isOwned && !stateClone[action.id].isWatched && !stateClone[action.id].isTemp) ||
          (action.scope === "watched" && !stateClone[action.id].isOwned && !stateClone[action.id].isAssigned && !stateClone[action.id].isTemp) ||
          (action.scope === "temp" && !stateClone[action.id].isOwned && !stateClone[action.id].isWatched && !stateClone[action.id].isAssigned) ||
          !action.scope)
      {
        delete stateClone[action.id]
      } else {
        stateClone[action.id] = {
          ...stateClone[action.id],
          ...(action.scope === "owned" && {isOwned: false}),
          ...(action.scope === "assigned" && {isAssigned: false}),
          ...(action.scope === "watched" && {isWatched: false}),
          ...(action.scope === "temp" && {isTemp: false})
        }
      }
      return stateClone
    case EMPTY_PROJECTS:
      return {}
    case FETCH_PROJECTS:
      if (action.scope === "owned") {
        stateClone = filterObj(stateClone, x => !x.isOwned && (x.isAssigned || x.isTemp || x.isWatched))
      } else if (action.scope === "assigned") {
        stateClone = filterObj(stateClone, x => !x.isAssigned && (x.isOwned || x.isTemp || x.isWatched))
      } else if (action.scope === "watched") {
        stateClone = filterObj(stateClone, x => !x.isWatched && (x.isOwned || x.isTemp || x.isAssigned))
      }
      for (const project of action.projects) {
        stateClone[project.id] = {
          ...project,
          isTemp: false,
          isOwned: stateClone[project.id]?.isOwned || action.scope === "owned",
          isAssigned: stateClone[project.id]?.isAssigned || action.scope === "assigned",
          isWatched: stateClone[project.id]?.isAssigned || action.scope === "watched"
        }
      }
      return stateClone
    case FETCH_CACHED_PROJECTS:
      return action.projects
    default:
      return state
  }
}