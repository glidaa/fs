import injectItemOrder from "../utils/injectItemOrder"
import removeItemOrder from "../utils/removeItemOrder"
import { CREATE_TASK, UPDATE_TASK, REMOVE_TASK, EMPTY_TASKS, FETCH_TASKS, FETCH_CACHED_TASKS } from "../actions/tasks"

export default function (state = {}, action) {
  let stateClone = {...state}
  switch(action.type) {
    case CREATE_TASK:
      stateClone = injectItemOrder(
        stateClone,
        action.taskState,
        action.taskState.prevTask,
        action.taskState.nextTask,
        "prevTask",
        "nextTask"
      )
      return {...stateClone, [action.taskState.id]: action.taskState}
    case UPDATE_TASK:
      const update = Object.fromEntries(Object.entries(action.update).filter(item => (
        item[0] === "prevTask" ||
        item[0] === "nextTask" ||
        item[0] === "task" ||
        item[0] === "description" ||
        item[0] === "due" ||
        item[0] === "tags" ||
        item[1] != null
      )))
      if (update.prevTask !== undefined || update.nextTask !== undefined) {
        stateClone = removeItemOrder(
          stateClone, 
          stateClone[update.id],
          "prevTask",
          "nextTask"
        )
        stateClone = injectItemOrder(
          stateClone,
          stateClone[update.id],
          update.prevTask,
          update.nextTask,
          "prevTask",
          "nextTask"
        )
      }
      return {
        ...stateClone,
        [update.id]: {
          ...stateClone[update.id],
          ...update
        }}
    case REMOVE_TASK:
      stateClone = removeItemOrder(
        stateClone,
        stateClone[action.id],
        "prevTask",
        "nextTask"
      )
      delete stateClone[action.id]
      return stateClone
    case EMPTY_TASKS:
      return {}
    case FETCH_TASKS:
      const newState = {}
      for (const task of action.tasks) {
        newState[task.id] = task
      }
      return newState
    case FETCH_CACHED_TASKS:
      return action.tasks
    default:
      return state
  }
}