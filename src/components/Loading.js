import React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import styles from "./Loading.module.scss"
import { graphqlOperation } from "@aws-amplify/api";
import * as appActions from "../actions/app"
import * as projectsActions from "../actions/projects"
import * as tasksActions from "../actions/tasks"
import * as userActions from "../actions/user"
import * as observersActions from "../actions/observers"
import * as queries from "../graphql/queries"
import { Navigate, useNavigate, useParams, useLocation } from "react-router-dom"
import { panelPages, AuthState } from '../constants';
import ProgressBar from "./UI/ProgressBar";
import uploadLocal from "../utils/uploadLocal";
import execGraphQL from "../utils/execGraphQL";

const Loading = (props) => {
  const { dispatch } = props
  const [shouldLogin, setShouldLogin] = useState(false)
  const [progressMax, setProgressMax] = useState(100)
  const [progressValue, setProgressValue] = useState(0)
  const [loadingMsg, setLoadingMsg] = useState("Please Wait A Moment")
  const navigate = useNavigate()
  const routeParams = useParams()
  const routeLocation = useLocation()
  useEffect(() => {
    (async () => {
    let currUser = await dispatch(userActions.handleFetchUser())
    if (currUser.state === AuthState.SignedIn) {
      setLoadingMsg("We Are Importing Your Local Projects")
      await uploadLocal()
    }
    if (routeParams.projectPermalink &&
        !routeParams.username &&
        currUser.state === AuthState.SignedOut) {
      setProgressMax(2)
      setLoadingMsg("We Are Fetching Your Own Projects")
      const projects = await dispatch(projectsActions.handleFetchOwnedProjects())
      const reqProject = Object.values(projects)
        .filter(x => x.permalink === `${routeParams.username}/${routeParams.projectPermalink}`)[0]
      if (reqProject) {
        dispatch(appActions.handleSetProject(reqProject.id, false))
        setProgressValue(progressValue + 1)
        setLoadingMsg("We Are Getting The Requested Tasks")
        await dispatch(tasksActions.handleFetchTasks(reqProject.id))
      }
      setProgressValue(progressValue + 2)
    } else if (routeParams.projectPermalink &&
      routeParams.username &&
      currUser.state === AuthState.SignedOut) {
        setShouldLogin(true)
        return 0
    } else if (routeParams.projectPermalink &&
      routeParams.username &&
      currUser.state === AuthState.SignedIn) {
        setProgressMax(5)
        setProgressValue(progressValue + 1)
        setLoadingMsg("We Are Fetching Your Own Projects")
        await dispatch(projectsActions.handleFetchOwnedProjects())
        setProgressValue(progressValue + 2)
        setLoadingMsg("We Are Fetching Projects Assigned To You")
        await dispatch(projectsActions.handleFetchAssignedProjects())
        setProgressValue(progressValue + 3)
        setLoadingMsg("We Are Fetching Projects Watched By You")
        const projects = await dispatch(projectsActions.handleFetchWatchedProjects())
        setProgressValue(progressValue + 4)
        await dispatch(observersActions.handleSetOwnedProjectsObservers())
        let reqProject = Object.values(projects).filter(x => x.permalink === `${routeParams.username}/${routeParams.projectPermalink}`)[0]
        if (!reqProject) {
          try {
            reqProject = (await execGraphQL(graphqlOperation(queries.getProjectByPermalink, {
              permalink: `${routeParams.username}/${routeParams.projectPermalink}`
            }))).data.getProjectByPermalink
            dispatch(projectsActions.createProject(reqProject, "temp"))
          } catch {
            reqProject = null
            if (routeParams.taskPermalink) {
              navigate(`/${routeParams.username}/${routeParams.projectPermalink}`, { replace: true })
            }
          }
        }
        if (reqProject) {
          dispatch(appActions.handleSetProject(reqProject.id, false))
          setLoadingMsg("We Are Getting The Requested Tasks")
          const tasks = await dispatch(tasksActions.handleFetchTasks(reqProject.id, true))
          if (routeParams.taskPermalink) {
            const reqTask = Object.values(tasks).filter(x => x.permalink === parseInt(routeParams.taskPermalink, 10))[0]
            if (reqTask) {
              dispatch(appActions.handleSetTask(reqTask.id, false))
              dispatch(appActions.setRightPanelPage(panelPages.TASK_HUB))
              dispatch(appActions.handleSetRightPanel(true))
            }
          } else {
            navigate(`/${routeParams.username}/${routeParams.projectPermalink}`, { replace: true })
          }
        }
        setProgressValue(progressValue + 5)
      } else {
        if (currUser.state === AuthState.SignedIn) {
          setProgressMax(3)
          setLoadingMsg("We Are Fetching Your Own Projects")
          await dispatch(projectsActions.handleFetchOwnedProjects())
          setProgressValue(progressValue + 1)
          setLoadingMsg("We Are Fetching Projects Assigned To You")
          await dispatch(projectsActions.handleFetchAssignedProjects())
          setProgressValue(progressValue + 2)
          setLoadingMsg("We Are Fetching Projects Watched By You")
          const projects = await dispatch(projectsActions.handleFetchWatchedProjects())
          setProgressValue(progressValue + 3)
          await dispatch(observersActions.handleSetOwnedProjectsObservers())
          const firstProject = Object.values(projects).filter(x => !x.prevProject && x.isOwned)?.[0]
          if (firstProject) {
            dispatch(appActions.handleSetProject(firstProject.id, false))
            navigate(`/${firstProject.permalink}`, { replace: true })
          }
        } else {
          setProgressMax(1)
          setLoadingMsg("We Are Fetching Your Own Projects")
          const projects = await dispatch(projectsActions.handleFetchOwnedProjects())
          setProgressValue(progressValue + 1)
          const firstProject = Object.values(projects).filter(x => !x.prevProject && x.isOwned)?.[0]
          if (firstProject) {
            dispatch(appActions.handleSetProject(firstProject.id, false))
            navigate(`/local/${firstProject.permalink}`, { replace: true })
          }
        }
      }
      dispatch(appActions.setLoading(false))
    })()
  }, [])
  return (
    <>
      {shouldLogin ? (
        <Navigate
          to={{
            pathname: "/login",
            state: { referrer: routeLocation.pathname }
          }}
        />
      ) : (
        <div className={styles.LoadingContainer}>
          <span>forwardslash</span>
          <ProgressBar
            max={progressMax}
            value={progressValue}
          />
          <span>{loadingMsg}</span>
        </div>
      )}
    </>
  )
}

export default connect((state) => ({
  user: state.user,
  projects: state.projects,
  tasks: state.tasks,
  comments: state.comments
}))(Loading);