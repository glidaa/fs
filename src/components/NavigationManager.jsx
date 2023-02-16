import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as appActions from "../actions/app"
import * as projectsActions from "../actions/projects"
import * as tasksActions from "../actions/tasks"
import * as queries from "../graphql/queries"
import { AuthState } from '../constants';
import { navigate, useRouter } from "./Router"
import API from "../amplify/API"

const NavigationManager = () => {
  const { routeLocation, routeParams } = useRouter();
  const dispatch = useDispatch()

  const selectedProject = useSelector(state => state.app.selectedProject)

  const projects = useSelector(state => state.projects)

  const loadedTasks = useSelector(state => state.tasks)

  const userState = useSelector(state => state.user.state)

  useEffect(() => {
    (async () => {
    if (routeParams) {
      const {
        username, projectPermalink, taskPermalink
      } = routeParams;
      if (username && projectPermalink) {
        let reqProject = Object.values(projects).filter(x => `${x.owner}/${x.permalink}` === `${username}/${projectPermalink}`)[0]
        if (!reqProject) {
          try {
            reqProject = (await API.execute(queries.getProjectByPermalink, {
              permalink: projectPermalink,
              owner: username
            })).data.getProjectByPermalink
            dispatch(projectsActions.createProject(reqProject, "temp"))
          } catch {
            reqProject = null
            if (taskPermalink) {
              navigate(`/${username}/${projectPermalink}`, true)
            }
          }
        }
        if (reqProject) {
          const prevSelectedProject = selectedProject
          dispatch(appActions.handleSetProject(reqProject.id, false));
          if (taskPermalink) {
            const tasks = prevSelectedProject === reqProject.id ?
              loadedTasks : await dispatch(tasksActions.handleFetchTasks(reqProject.id, true))
            const reqTask = Object.values(tasks).filter(x => x.permalink === parseInt(taskPermalink, 10))[0]
            if (reqTask) {
              dispatch(appActions.handleSetTask(reqTask.id, false));
            } else {
              navigate(`/${username}/${projectPermalink}`, true)
            }
          } else {
            navigate(`/${username}/${projectPermalink}`, true);
          }
        }
      } else if (userState !== AuthState.SignedIn && projectPermalink) {
        const reqProject = Object.values(projects).filter(x => `${x.owner}/${x.permalink}` === `${username}/${projectPermalink}`)[0];
        if (reqProject) {
          dispatch(appActions.handleSetProject(reqProject.id, false));
        }
      }
    }
    })()
  }, [routeLocation, userState]);
  return null
}

export default NavigationManager;