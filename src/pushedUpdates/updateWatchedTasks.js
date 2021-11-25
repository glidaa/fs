import { graphqlOperation } from "@aws-amplify/api";
import * as observersActions from "../actions/observers";
import * as projectsActions from "../actions/projects"
import * as queries from "../graphql/queries"
import execGraphQL from "../utils/execGraphQL";

const updateWatchedTasks = async (dispatch, getState, pushedUpdate) => {
  const { watchedTasks } = pushedUpdate
  const { projects } = getState()
  const currWatchedProjects = Object.values(projects).filter(x => x.isWatched).map(x => x.id)
  const watchedProjects = [...new Set(watchedTasks.map(taskPath => taskPath.match(/(.*)\/.*/)[1]))]
  const newWatchedProjects = watchedProjects.filter(x => !currWatchedProjects.includes(x))
  const unwatchedProjects = currWatchedProjects.filter(x => !watchedProjects.includes(x));
  for (const unwatchedProject of unwatchedProjects) {
    if (!(projects[unwatchedProject].isAssigned || projects[unwatchedProject].isTemp)) {
      dispatch(observersActions.handleClearProjectObservers(unwatchedProject))
    }
    dispatch(projectsActions.removeProject(unwatchedProject, "watched"))
  }
  for (const newWatchedProject of newWatchedProjects) {
    const { projects } = getState()
    if (projects[newWatchedProject]) {
      dispatch(projectsActions.createProject(projects[newWatchedProject], "watched"))
    } else {
      try {
        const newWatchedProjectData = (await execGraphQL(graphqlOperation(queries.getProjectById, {
          projectID: newWatchedProject
        }))).data.getProjectByID
        if (newWatchedProjectData) {
          dispatch(projectsActions.createProject(newWatchedProjectData, "watched"))
          await dispatch(observersActions.handleSetProjectObservers(newWatchedProject))
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
}

export default updateWatchedTasks