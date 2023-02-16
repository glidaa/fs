import * as projectsActions from "../actions/projects"
import API from "../amplify/API";
import * as queries from "../graphql/queries"
import PubSub from "../amplify/PubSub";

const updateWatchedTasks = async (dispatch, getState, pushedUpdate) => {
  const { watchedTasks } = pushedUpdate
  const { projects } = getState()
  const currWatchedProjects = Object.values(projects).filter(x => x.isWatched).map(x => x.id)
  const watchedProjects = [...new Set(watchedTasks.map(taskPath => taskPath.match(/(.*)\/.*/)[1]))]
  const newWatchedProjects = watchedProjects.filter(x => !currWatchedProjects.includes(x))
  const unwatchedProjects = currWatchedProjects.filter(x => !watchedProjects.includes(x));
  for (const unwatchedProject of unwatchedProjects) {
    if (!(projects[unwatchedProject].isAssigned || projects[unwatchedProject].isTemp)) {
      PubSub.unsubscribeTopic("project", unwatchedProject)
    }
    dispatch(projectsActions.removeProject(unwatchedProject, "watched"))
  }
  for (const newWatchedProject of newWatchedProjects) {
    const { projects } = getState()
    if (projects[newWatchedProject]) {
      dispatch(projectsActions.createProject(projects[newWatchedProject], "watched"))
    } else {
      try {
        const newWatchedProjectData = (await API.execute(queries.getProjectById, {
          projectId: newWatchedProject
        })).data.getProjectById
        if (newWatchedProjectData) {
          dispatch(projectsActions.createProject(newWatchedProjectData, "watched"))
          PubSub.subscribeTopic("project", newWatchedProject)
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
}

export default updateWatchedTasks