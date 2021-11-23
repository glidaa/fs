import { useEffect, useState, useRef } from "react"
import { connect } from "react-redux"
import { graphqlOperation } from "@aws-amplify/api";
import * as appActions from "../actions/app"
import * as projectsActions from "../actions/projects"
import * as tasksActions from "../actions/tasks"
import * as userActions from "../actions/user"
import * as usersActions from "../actions/users"
import * as observersActions from "../actions/observers"
import * as mutationsActions from "../actions/mutations"
import * as collaborationActions from "../actions/collaboration"
import * as queries from "../graphql/queries"
import * as mutationsGraphQL from "../graphql/mutations"
import * as cacheController from "../controllers/cache"
import { useNavigate, useParams } from "react-router-dom"
import { panelPages, AuthState } from '../constants';
import execGraphQL from "../utils/execGraphQL";
import store from "../store";
import * as mutationID from "../utils/mutationID";

const SyncManager = (props) => {
  const { app, mutations, user, dispatch } = props
  const [isInitial, setIsInitial] = useState(true)
  const ws = useRef(null)
  const navigate = useNavigate()
  const routeParams = useParams()
  useEffect(() => {
    if (user.state === AuthState.SignedIn) {
      if (isInitial) {
        setIsInitial(false)
      } else if (app.isOffline) {
        dispatch(appActions.setSynced(false))
        dispatch(usersActions.addCachedUsers(cacheController.getUsers()))
        dispatch(observersActions.handleClearNotificationsObservers())
        dispatch(observersActions.handleClearUserObservers())
        dispatch(observersActions.handleClearOwnedProjectsObservers())
        dispatch(observersActions.handleClearProjectObservers())
        dispatch(observersActions.handleClearTasksObservers())
        dispatch(observersActions.handleClearCommentsObservers())
      } else {
        (async () => {
          const currUser = await dispatch(userActions.handleFetchUser())
          await dispatch(collaborationActions.handleInitSession());
          if (routeParams.projectPermalink &&
            routeParams.username &&
            currUser.state === AuthState.SignedIn) {
              await dispatch(projectsActions.handleFetchOwnedProjects(true))
              await dispatch(projectsActions.handleFetchAssignedProjects(true))
              const projects = await dispatch(projectsActions.handleFetchWatchedProjects(true))
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
              if (!(app.selectedProject in projects) && reqProject) {
                dispatch(appActions.handleSetProject(reqProject.id, false))
                const tasks = await dispatch(tasksActions.handleFetchTasks(reqProject.id, true))
                if (!(app.selectedTask in tasks) && routeParams.taskPermalink) {
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
          } else if (currUser.state === AuthState.SignedIn) {
            await dispatch(projectsActions.handleFetchOwnedProjects(true))
            await dispatch(projectsActions.handleFetchAssignedProjects(true))
            const projects = await dispatch(projectsActions.handleFetchWatchedProjects(true))
            await dispatch(observersActions.handleSetOwnedProjectsObservers())
            const firstProject = Object.values(projects).filter(x => !x.prevProject && x.isOwned)?.[0]
            if (firstProject) {
              dispatch(appActions.handleSetProject(firstProject.id, false))
              navigate(`/${firstProject.permalink}`, { replace: true })
            }
          }
          if (store.getState().app.isOffline) {
            dispatch(appActions.setSynced(false))
            dispatch(usersActions.addCachedUsers(cacheController.getUsers()))
          } else {
            dispatch(appActions.setSynced(true))
          }
        })()
      }
    }
  }, [app.isOffline])
  useEffect(() => {
    if (mutations[0]) {
      const [mutationType, data, successCallback, errorCallback] = mutations[0];
      const generatedMutationID = mutationID.generate(user.data.username);
      const query = mutationsGraphQL[mutationType];
      const queryData = { input: { ...data, mutationID: generatedMutationID } };
      execGraphQL(graphqlOperation(query, queryData))
        .then((res) => {
          dispatch(mutationsActions.nextMutation());
          if (successCallback) successCallback(res);
        })
        .catch((err) => {
          console.error(err);
          if (errorCallback) errorCallback(err);
        });
    }
  }, [mutations[0]])
  return null
}

export default connect((state) => ({
  app: state.app,
  mutations: state.mutations,
  user: state.user
}))(SyncManager);