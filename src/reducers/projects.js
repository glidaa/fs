import { CREATE_PROJECT, UPDATE_PROJECT, REMOVE_PROJECT, EMPTY_PROJECTS, FETCH_PROJECTS, FETCH_CACHED_PROJECTS } from "../actions/projects"
import filterObj from "../utils/filterObj"

const projectsReducer = (state = {}, action) => {
  let stateClone = {...state}
  switch(action.type) {
    case CREATE_PROJECT:
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
      return {
        ...stateClone,
        [update.id]: {
          ...stateClone[update.id],
          ...update
        }
      }
    case REMOVE_PROJECT:
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
      const incomingIds = action.projects.map(x => x.id);
      if (action.scope === "owned") {
        stateClone = filterObj(stateClone, x => (!x.isOwned || incomingIds.includes(x.id)) && (x.isAssigned || x.isTemp || x.isWatched))
      } else if (action.scope === "assigned") {
        stateClone = filterObj(stateClone, x => (!x.isAssigned || incomingIds.includes(x.id)) && (x.isOwned || x.isTemp || x.isWatched))
      } else if (action.scope === "watched") {
        stateClone = filterObj(stateClone, x => (!x.isWatched || incomingIds.includes(x.id)) && (x.isOwned || x.isTemp || x.isAssigned))
      }
      for (const project of action.projects) {
        stateClone[project.id] = {
          ...project,
          isTemp: false,
          isOwned: stateClone[project.id]?.isOwned || action.scope === "owned",
          isAssigned: stateClone[project.id]?.isAssigned || action.scope === "assigned",
          isWatched: stateClone[project.id]?.isWatched || action.scope === "watched"
        }
      }
      return stateClone
    case FETCH_CACHED_PROJECTS:
      return action.projects
    default:
      return state
  }
}

export default projectsReducer;
