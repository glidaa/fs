import * as usersActions from "./users"

export const SET_SESSION = "SET_SESSION";
export const JOIN_PROEJCT = "JOIN_PROEJCT";
export const LEAVE_PROJECT = "LEAVE_PROJECT";
export const FOCUS_TASK = "FOCUS_TASK";
export const UNFOCUS_TASK = "UNFOCUS_TASK";
export const SET_TXT_CURSOR = "SET_TXT_CURSOR";
export const RESET_COLLAB_DATA = "RESET_COLLAB_DATA";

const setSession = (session) => ({
  type: SET_SESSION,
  session
});

const setJoinedProject = (projectID, username) => ({
  type: JOIN_PROEJCT,
  projectID,
  username
});

const setLeftProject = (projectID, username) => ({
  type: LEAVE_PROJECT,
  projectID,
  username
});

const setFocusedTask = (taskID, username) => ({
  type: FOCUS_TASK,
  taskID,
  username
});

const setUnfocusedTask = (taskID, username) => ({
  type: UNFOCUS_TASK,
  taskID,
  username
});

const setTxtCursor = (taskID, pos, username) => ({
  type: SET_TXT_CURSOR,
  taskID,
  pos,
  username
});

const resetCollabData = () => ({
  type: RESET_COLLAB_DATA
});

export const handleInitSession = () => async (dispatch, getState) => {
  const session = getState().collaboration.session;
  const isOffline = getState().app.isOffline;
  const user = getState().user;
  if (session?.readyState !== WebSocket.OPEN) {
    await (() => new Promise((resolve, reject) => {
      if (isOffline) resolve({ errors: [{ message: "Network Error" }] })
      const nextSession = new WebSocket(`wss://0ly6ezq1tc.execute-api.us-east-1.amazonaws.com/Prod`)
      nextSession.onopen = () => {
        console.log("Websocket opened")
        dispatch(setSession(nextSession))
        resolve(nextSession)
      }
      nextSession.onmessage = async (event) => {
        const { action, username, ...data } = JSON.parse(event.data)
        if (username) {
          await dispatch(usersActions.handleAddUsers([username]))
          switch (action) {
            case "JOIN_PROJECT":
              dispatch(setJoinedProject(data.projectID, username))
              break;
            case "LEAVE_PROJECT":
              if (username !== user.data.username) {
                dispatch(setLeftProject(data.projectID, username))
              }
              break;
            case "FOCUS_TASK":
              dispatch(setFocusedTask(data.taskID, username))
              break;
            case "UNFOCUS_TASK":
              dispatch(setUnfocusedTask(data.taskID, username))
              break;
            case "MOVE_TXT_CURSOR":
              dispatch(setTxtCursor(data.taskID, data.pos, username))
              break;
          }
        }
        console.log("Websocket message", JSON.parse(event.data))
      }
      nextSession.onerror = (err) => {
        console.log("Websocket error")
        console.log(err)
        reject(err)
      }
      nextSession.onclose = (event) => {
        console.log("Websocket closed")
        console.log(event)
      }
    }))()
  }
}

export const handleJoinProject = (projectID) => async (dispatch, getState) => {
  const userData = getState().user.data;
  await dispatch(usersActions.handleAddUsers([userData.username]))
  dispatch(resetCollabData())
  dispatch(setJoinedProject(projectID, userData.username))
  const session = getState().collaboration.session;
  if (session?.readyState === WebSocket.OPEN) {
    const dataToSend = {
      action: "joinproject",
      data: {
        projectID: projectID,
        jwt: userData.jwt
      }
    }
    session.send(JSON.stringify(dataToSend));
  }
}

export const handleSendAction = (data) => async (dispatch, getState) => {
  const session = getState().collaboration.session;
  if (session?.readyState === WebSocket.OPEN) {
    const dataToSend = {
      action: "sendmessage",
      data: data
    }
    session.send(JSON.stringify(dataToSend));
  }
}

export const handleCloseSession = () => async (dispatch, getState) => {
  const session = getState().collaboration.session;
  if (session?.readyState === WebSocket.OPEN) {
    dispatch(setSession(null))
    await session.close();
  }
}