import { CREATE_TASK, UPDATE_TASK, REMOVE_TASK, EMPTY_TASKS, FETCH_TASKS, FETCH_CACHED_TASKS } from "../actions/tasks"

const tasksReducer = (state = {}, action) => {
  let stateClone = {...state}
  switch(action.type) {
    case CREATE_TASK:
      return {...stateClone, [action.taskState.id]: action.taskState}
    case UPDATE_TASK:
      const { id, field, value, action: updateAction } = action.update
      if (updateAction === "append") {
        if (!stateClone[id][field]) stateClone[id][field] = []
        if (stateClone[id][field].indexOf(value) === -1) {
          stateClone[id][field].push(value)
        }
      } else if (updateAction === "remove") {
        if (!stateClone[id][field]) stateClone[id][field] = []
        stateClone[id][field] = stateClone[id][field].filter(item => item !== value)
      } else {
        stateClone[id][field] = value
      }
      return stateClone
    case REMOVE_TASK:
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

export default tasksReducer;
