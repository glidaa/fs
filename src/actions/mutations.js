export const ADD_MUTATION = "ADD_MUTATION";
export const REMOVE_MUTATION = "REMOVE_MUTATION";

export const addMutation = (mutation) => ({
  type: ADD_MUTATION,
  mutation
})

export const removeMutation = (mutation) => ({
  type: REMOVE_MUTATION,
  mutation
})