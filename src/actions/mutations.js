export const SCHEDULE_MUTATION = "SCHEDULE_MUTATION";
export const NEXT_MUTATION = "NEXT_MUTATION";

export const scheduleMutation = (mutationType, data, sucessCallback = null, errorCallback = null) => ({
  type: SCHEDULE_MUTATION,
  mutationType,
  data,
  sucessCallback,
  errorCallback,
});

export const nextMutation = (mutation) => ({
  type: NEXT_MUTATION,
  mutation,
});
