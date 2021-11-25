export const SCHEDULE_MUTATION = "SCHEDULE_MUTATION";
export const NEXT_MUTATION = "NEXT_MUTATION";

export const scheduleMutation = (mutationType, data, successCallback = null, errorCallback = null) => ({
  type: SCHEDULE_MUTATION,
  mutationType,
  data,
  successCallback,
  errorCallback,
});

export const nextMutation = (mutation) => ({
  type: NEXT_MUTATION,
  mutation,
});
