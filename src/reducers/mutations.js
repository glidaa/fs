import { SCHEDULE_MUTATION, NEXT_MUTATION } from "../actions/mutations";

export default function (state = [], action) {
  let stateClone = [...state];
  switch (action.type) {
    case SCHEDULE_MUTATION:
      const { mutationType, data, successCallback, errorCallback } = action;
      const newMutation = [mutationType, data, successCallback, errorCallback];
      if (/^update\w+$/.test(mutationType)) {
        for (let i = stateClone.length - 1; i > 0; i--) {
          if (stateClone[i][0] === mutationType && stateClone[i][1].id === data.id) {
            const redundantMutation = stateClone.splice(i--, 1);
            newMutation[1] = { ...newMutation[1], ...redundantMutation[1] };
          } else {
            break
          }
        }
      }
      return [...stateClone, newMutation];
    case NEXT_MUTATION:
      stateClone.shift();
      return stateClone;
    default:
      return state;
  }
}
