import React from "react"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import styles from "./Loading.module.scss"
import * as appActions from "../actions/app"
import * as notificationsActions from "../actions/notifications"
import * as projectsActions from "../actions/projects"
import * as tasksActions from "../actions/tasks"
import * as userActions from "../actions/user"
import * as usersActions from "../actions/users"
import * as queries from "../graphql/queries"
import * as cacheController from "../controllers/cache"
import { panelPages, AuthState } from '../constants';
import ProgressBar from "./UI/ProgressBar";
import uploadLocal from "../utils/uploadLocal";
import store from "../store";
import { navigate, useRouterNoUpdates } from "./Router"
import API from "../amplify/API"
import PubSub from "../amplify/PubSub"
import sortByRank from "../utils/sortByRank"

const Loading = (props) => {
  const { onFinish } = props
  const [progressMax, setProgressMax] = useState(100)
  const [progressValue, setProgressValue] = useState(0)
  const [loadingMsg, setLoadingMsg] = useState("Please Wait A Moment")
  const { routeParams } = useRouterNoUpdates()
  const dispatch = useDispatch()
  useEffect(() => {
    (async () => {
    const currUser = await dispatch(userActions.handleFetchUser())
    if (currUser.state === AuthState.SignedIn) {
      setLoadingMsg("Importing Your Local Projects")
      await uploadLocal()
    }
    if (routeParams.projectPermalink &&
        !routeParams.username &&
        currUser.state === AuthState.SignedOut) {
      setProgressMax(2)
      setLoadingMsg("Fetching Your Own Projects")
      const projects = await dispatch(projectsActions.handleFetchOwnedProjects())
      const reqProject = Object.values(projects)
        .filter(x => x.permalink === `${routeParams.projectPermalink}`)[0]
      if (reqProject) {
        dispatch(appActions.handleSetProject(reqProject.id, false))
        setProgressValue(progressValue + 1)
        setLoadingMsg("Getting The Requested Tasks")
        await dispatch(tasksActions.handleFetchTasks(reqProject.id))
      }
      setProgressValue(progressValue + 2)
    } else if (routeParams.projectPermalink &&
      routeParams.username &&
      currUser.state === AuthState.SignedOut) {
      let reqProject = null;
      try {
        reqProject = (await API.execute(queries.getProjectByPermalink, {
          permalink: routeParams.projectPermalink,
          owner: routeParams.username
        })).data.getProjectByPermalink
        dispatch(projectsActions.createProject(reqProject, "temp"))
      } catch {
        reqProject = null
        if (routeParams.taskPermalink) {
          navigate(`/${routeParams.username}/${routeParams.projectPermalink}`, true)
        }
      }
      if (reqProject) {
        dispatch(appActions.handleSetProject(reqProject.id, false))
        setLoadingMsg("Getting The Requested Tasks")
        const tasks = await dispatch(tasksActions.handleFetchTasks(reqProject.id, true))
        if (routeParams.taskPermalink) {
          const reqTask = Object.values(tasks).filter(x => x.permalink === parseInt(routeParams.taskPermalink, 10))[0]
          if (reqTask) {
            dispatch(appActions.handleSetTask(reqTask.id, false))
            dispatch(appActions.setRightPanelPage(panelPages.TASK_HUB))
            dispatch(appActions.handleSetRightPanel(true))
          } else {
            navigate(`/${routeParams.username}/${routeParams.projectPermalink}`, true)
          }
        } else {
          navigate(`/${routeParams.username}/${routeParams.projectPermalink}`, true)
        }
      }
    } else if (routeParams.projectPermalink &&
      routeParams.username &&
      currUser.state === AuthState.SignedIn) {
        setProgressMax(6)
        setLoadingMsg("Fetching Notifications")
        await dispatch(notificationsActions.handleFetchNotifications())
        PubSub.subscribeTopic("notifications")
        setProgressValue(progressValue + 1)
        setLoadingMsg("Fetching Your Own Projects")
        await dispatch(projectsActions.handleFetchOwnedProjects())
        setProgressValue(progressValue + 2)
        setLoadingMsg("Fetching Projects Assigned To You")
        await dispatch(projectsActions.handleFetchAssignedProjects())
        setProgressValue(progressValue + 3)
        setLoadingMsg("Fetching Projects Watched By You")
        const projects = await dispatch(projectsActions.handleFetchWatchedProjects())
        setProgressValue(progressValue + 4)
        PubSub.subscribeTopic("ownedProjects")
        let reqProject = Object.values(projects).filter(x => `${x.owner}/${x.permalink}` === `${routeParams.username}/${routeParams.projectPermalink}`)[0]
        if (!reqProject) {
          try {
            reqProject = (await API.execute(queries.getProjectByPermalink, {
              permalink: routeParams.projectPermalink,
              owner: routeParams.username
            })).data.getProjectByPermalink
            dispatch(projectsActions.createProject(reqProject, "temp"))
          } catch {
            reqProject = null
            if (routeParams.taskPermalink) {
              navigate(`/${routeParams.username}/${routeParams.projectPermalink}`, true)
            }
          }
        }
        if (reqProject) {
          dispatch(appActions.handleSetProject(reqProject.id, false))
          setLoadingMsg("Getting The Requested Tasks")
          const tasks = await dispatch(tasksActions.handleFetchTasks(reqProject.id, true))
          if (routeParams.taskPermalink) {
            const reqTask = Object.values(tasks).filter(x => x.permalink === parseInt(routeParams.taskPermalink, 10))[0]
            if (reqTask) {
              dispatch(appActions.handleSetTask(reqTask.id, false))
              dispatch(appActions.setRightPanelPage(panelPages.TASK_HUB))
              dispatch(appActions.handleSetRightPanel(true))
            } else {
              navigate(`/${routeParams.username}/${routeParams.projectPermalink}`, true)
            }
          } else {
            navigate(`/${routeParams.username}/${routeParams.projectPermalink}`, true)
          }
        }
        setProgressValue(progressValue + 5)
      } else {
        if (currUser.state === AuthState.SignedIn) {
          setProgressMax(4)
          setLoadingMsg("Fetching Notifications")
          await dispatch(notificationsActions.handleFetchNotifications())
          PubSub.subscribeTopic("notifications")
          setProgressValue(progressValue + 1)
          setLoadingMsg("Fetching Your Own Projects")
          await dispatch(projectsActions.handleFetchOwnedProjects())
          setProgressValue(progressValue + 1)
          setLoadingMsg("Fetching Projects Assigned To You")
          await dispatch(projectsActions.handleFetchAssignedProjects())
          setProgressValue(progressValue + 2)
          setLoadingMsg("Fetching Projects Watched By You")
          const projects = await dispatch(projectsActions.handleFetchWatchedProjects())
          setProgressValue(progressValue + 3)
          PubSub.subscribeTopic("ownedProjects")
          const firstProject = sortByRank(Object.values(projects).filter(x => x.isOwned))?.[0]
          if (firstProject) {
            dispatch(appActions.handleSetProject(firstProject.id, false))
            navigate(`/${firstProject.owner}/${firstProject.permalink}`, true)
          }
        } else {
          setProgressMax(1)
          setLoadingMsg("Fetching Your Own Projects")
          const projects = await dispatch(projectsActions.handleFetchOwnedProjects())
          setProgressValue(progressValue + 1)
          const firstProject = sortByRank(Object.values(projects).filter(x => x.isOwned))?.[0]
          if (firstProject) {
            dispatch(appActions.handleSetProject(firstProject.id, false))
            navigate(`/local/${firstProject.permalink}`, true)
          }
        }
      }
      if (currUser.state === AuthState.SignedIn) {
        if (store.getState().app.isOffline) {
          dispatch(appActions.setSynced(false))
          dispatch(usersActions.addCachedUsers(cacheController.getUsers()))
        } else {
          dispatch(appActions.setSynced(true))
        }
      }
      onFinish()
    })()
  }, [])
  return (
    <div className={styles.LoadingContainer}>
      <span>forwardslash</span>
      <ProgressBar
        max={progressMax}
        value={progressValue}
      />
      <span>{loadingMsg}</span>
    </div>
  )
}

export default Loading;