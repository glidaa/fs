export const PUSH_NOTIFICATION = "PUSH_NOTIFICATION";
export const DISMISS_NOTIFICATION = "DISMISS_NOTIFICATION";

export const push = (id) => ({
  type: PUSH_NOTIFICATION,
  id
})

export const dismiss = (id) => ({
  type: DISMISS_NOTIFICATION,
  id
})