import React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { graphqlOperation } from "@aws-amplify/api";
import * as appActions from "../actions/app"
import * as projectsActions from "../actions/projects"
import * as tasksActions from "../actions/tasks"
import * as userActions from "../actions/user"
import * as observersActions from "../actions/observers"
import * as queries from "../graphql/queries"
import { Navigate, useNavigate, useParams, useLocation } from "react-router-dom"
import { panelPages, AuthState } from '../constants';
import execGraphQL from "../utils/execGraphQL";
import store from "../store"

const SyncManager = (props) => {
  const { app, user, dispatch } = props
  const [isInitial, setIsInitial] = useState(true)
  const [shouldLogin, setShouldLogin] = useState(false)
  const navigate = useNavigate()
  const routeParams = useParams()
  const routeLocation = useLocation()
  useEffect(() => {
    if (user.state === AuthState.SignedIn) {
      if (isInitial) {
        setIsInitial(false)
      } else if (app.isOffline) {
        dispatch(appActions.setSynced(false))
        dispatch(observersActions.handleClearNotificationsObservers())
        dispatch(observersActions.handleClearUserObservers())
        dispatch(observersActions.handleClearOwnedProjectsObservers())
        dispatch(observersActions.handleClearProjectObservers())
        dispatch(observersActions.handleClearTasksObservers())
        dispatch(observersActions.handleClearCommentsObservers())
      } else {
        (async () => {
          const currUser = await dispatch(userActions.handleFetchUser())
          if (routeParams.projectPermalink &&
              !routeParams.username &&
              currUser.state === AuthState.SignedOut) {
            const projects = await dispatch(projectsActions.handleFetchOwnedProjects())
            const reqProject = Object.values(projects)
              .filter(x => x.permalink === `${routeParams.username}/${routeParams.projectPermalink}`)[0]
            if (reqProject) {
              dispatch(appActions.handleSetProject(reqProject.id, false))
              await dispatch(tasksActions.handleFetchTasks(reqProject.id))
            }
          } else if (routeParams.projectPermalink &&
            routeParams.username &&
            currUser.state === AuthState.SignedOut) {
              setShouldLogin(true)
              return 0
          } else if (routeParams.projectPermalink &&
            routeParams.username &&
            currUser.state === AuthState.SignedIn) {
              await dispatch(projectsActions.handleFetchOwnedProjects())
              await dispatch(projectsActions.handleFetchAssignedProjects())
              const projects = await dispatch(projectsActions.handleFetchWatchedProjects())
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
          } else {
            if (currUser.state === AuthState.SignedIn) {
              await dispatch(projectsActions.handleFetchOwnedProjects())
              await dispatch(projectsActions.handleFetchAssignedProjects())
              const projects = await dispatch(projectsActions.handleFetchWatchedProjects())
              await dispatch(observersActions.handleSetOwnedProjectsObservers())
              const firstProject = Object.values(projects).filter(x => !x.prevProject && x.isOwned)?.[0]
              if (firstProject) {
                dispatch(appActions.handleSetProject(firstProject.id, false))
                navigate(`/${firstProject.permalink}`, { replace: true })
              }
            } else {
              const projects = await dispatch(projectsActions.handleFetchOwnedProjects())
              const firstProject = Object.values(projects).filter(x => !x.prevProject && x.isOwned)?.[0]
              if (firstProject) {
                dispatch(appActions.handleSetProject(firstProject.id, false))
                navigate(`/local/${firstProject.permalink}`, { replace: true })
              }
            }
          }
          if (store.getState().app.isOffline) {
            dispatch(appActions.setSynced(false))
          } else {
            dispatch(appActions.setSynced(true))
          }
        })()
      }
    }
  }, [app.isOffline])
  return shouldLogin && (
    <Navigate
      to={{
        pathname: "/login",
        state: { referrer: routeLocation.pathname }
      }}
    />
  )
}

export default connect((state) => ({
  app: state.app,
  user: state.user
}))(SyncManager);