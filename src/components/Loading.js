import React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import styles from "./Loading.module.scss"
import { API, graphqlOperation } from "@aws-amplify/api";
import { Auth } from "@aws-amplify/auth";
import * as appActions from "../actions/app"
import * as projectsActions from "../actions/projects"
import * as tasksActions from "../actions/tasks"
import * as userActions from "../actions/user"
import * as observersActions from "../actions/observers"
import * as queries from "../graphql/queries"
import * as mutations from "../graphql/mutations"
import { Redirect, useHistory } from "react-router-dom"
import { panelPages, AuthState } from '../constants';
import ProgressBar from "./UI/ProgressBar";

const Loading = (props) => {
  const { user, route, dispatch } = props
  const [shouldLogin, setShouldLogin] = useState(false)
  const [progressMax, setProgressMax] = useState(100)
  const [progressValue, setProgressValue] = useState(0)
  const [loadingMsg, setLoadingMsg] = useState("Please Wait A Moment")
  const history = useHistory()
  useEffect(() => {
    (async () => {
    const { match: { params } } = route
    const authData = await Auth.currentUserInfo()
    let currUser = {...user}
    if (authData) {
      const userData = (await API.graphql(
        graphqlOperation(
          queries.getUserByUsername, {
            username: authData.username
          }
        )
      )).data.getUserByUsername
      dispatch(userActions.handleSetData(userData))
      dispatch(userActions.handleSetState(AuthState.SignedIn))
      await dispatch(observersActions.handleSetOwnedProjectsObservers())
      currUser = {
        state: AuthState.SignedIn,
        data:userData
      }
    }
    if (currUser.state === AuthState.SignedIn) {
      const localProjectsList = JSON.parse(window.localStorage.getItem("projects"))
      if (localProjectsList) {
        const localProjects = Object.values(localProjectsList)
        if (localProjects.length) {
          try {
            setLoadingMsg("We Are Importing Your Local Projects")
            await API.graphql(graphqlOperation(mutations.importData, {
              data: JSON.stringify(localProjects)
            }))
            window.localStorage.removeItem('projects')
          } catch (err) {
            console.error(err)
          }
        }
      }
    }
    if (params.projectPermalink &&
        !params.username &&
        currUser.state === AuthState.SignedOut) {
      setProgressMax(2)
      setLoadingMsg("We Are Fetching Your Own Projects")
      const projects = await dispatch(projectsActions.handleFetchOwnedProjects())
      const reqProject = Object.values(projects)
        .filter(x => x.permalink === `${params.username}/${params.projectPermalink}`)[0]
      if (reqProject) {
        dispatch(appActions.handleSetProject(reqProject.id, false))
        setProgressValue(progressValue + 1)
        setLoadingMsg("We Are Getting The Requested Tasks")
        await dispatch(tasksActions.handleFetchTasks(reqProject.id))
      }
      setProgressValue(progressValue + 2)
    } else if (params.projectPermalink &&
      params.username &&
      currUser.state === AuthState.SignedOut) {
        setShouldLogin(true)
        return 0
    } else if (params.projectPermalink &&
      params.username &&
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
        let reqProject = Object.values(projects).filter(x => x.permalink === `${params.username}/${params.projectPermalink}`)[0]
        if (!reqProject) {
          try {
            reqProject = (await API.graphql(graphqlOperation(queries.getProjectByPermalink, {
              permalink: `${params.username}/${params.projectPermalink}`
            }))).data.getProjectByPermalink
            dispatch(projectsActions.createProject(reqProject, "temp"))
          } catch {
            reqProject = null
            if (params.taskPermalink) {
              history.replace(`/${params.username}/${params.projectPermalink}`)
            }
          }
        }
        if (reqProject) {
          dispatch(appActions.handleSetProject(reqProject.id, false))
          setLoadingMsg("We Are Getting The Requested Tasks")
          const tasks = await dispatch(tasksActions.handleFetchTasks(reqProject.id, true))
          if (params.taskPermalink) {
            const reqTask = Object.values(tasks).filter(x => x.permalink === parseInt(params.taskPermalink, 10))[0]
            if (reqTask) {
              dispatch(appActions.handleSetTask(reqTask.id, false))
              dispatch(appActions.setRightPanelPage(panelPages.TASK_HUB))
              dispatch(appActions.handleSetRightPanel(true))
            }
          } else {
            history.replace(`/${params.username}/${params.projectPermalink}`)
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
            history.replace(`/${firstProject.permalink}`)
          }
        } else {
          setProgressMax(1)
          setLoadingMsg("We Are Fetching Your Own Projects")
          const projects = await dispatch(projectsActions.handleFetchOwnedProjects())
          setProgressValue(progressValue + 1)
          const firstProject = Object.values(projects).filter(x => !x.prevProject && x.isOwned)?.[0]
          if (firstProject) {
            dispatch(appActions.handleSetProject(firstProject.id, false))
            history.replace(`/local/${firstProject.permalink}`)
          }
        }
      }
      dispatch(appActions.setLoading(false))
    })()
  }, [])
  return (
    <>
      {shouldLogin ? (
        <Redirect
          to={{
            pathname: "/login",
            state: { referrer: route.location.pathname }
          }}
        />
      ) : (
        <div className={styles.LoadingContainer}>
          <span>Forward Slash</span>
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