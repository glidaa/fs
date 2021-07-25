import injectItemOrder from "../utils/injectItemOrder"
import removeItemOrder from "../utils/removeItemOrder"
import { CREATE_TASK, UPDATE_TASK, REMOVE_TASK, EMPTY_TASKS, FETCH_TASKS } from "../actions/tasks"

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
      const { update } = action
      if (update.prevTask !== undefined && update.nextTask !== undefined) {
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
    default:
      return state
  }
}