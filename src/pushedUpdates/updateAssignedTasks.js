import { API, graphqlOperation } from "aws-amplify";
import * as projectsActions from "../actions/projects"
import * as queries from "../graphql/queries"

const updateWatchedTasks = async (dispatch, getState, pushedUpdate) => {
  const { watchedTasks } = pushedUpdate
  const { projects } = getState()
  const currWatchedProjects = Object.values(projects).filter(x => x.isWatched).map(x => x.id)
  const watchedProjects = [...new Set(watchedTasks.map(taskPath => taskPath.match(/(.*)\/.*/)[1]))]
  const newWatchedProjects = watchedProjects.filter(x => !currWatchedProjects.includes(x))
  const unwatchedProjects = currWatchedProjects.filter(x => !watchedProjects.includes(currWatchedProjects));
  for (const unwatchedProject of unwatchedProjects) {
    dispatch(projectsActions.removeProject(unwatchedProject, "watched"))
  }
  for (const newWatchedProject of newWatchedProjects) {
    const { projects } = getState()
    if (Object.keys(projects).includes(newWatchedProject)) {
      dispatch(projectsActions.createProject(projects[newWatchedProject], "watched"))
    } else {
      try {
        const newWatchedProjectData = (await API.graphql(graphqlOperation(queries.getProjectById, {
          projectID: newWatchedProject
        }))).data.getProjectByID
        if (newWatchedProjectData) {
          dispatch(projectsActions.createProject(newWatchedProjectData, "watched"))
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
}

export default updateWatchedTasks