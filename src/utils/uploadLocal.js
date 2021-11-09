import { API, graphqlOperation } from "@aws-amplify/api";
import * as mutations from "../graphql/mutations"

export default async () => {
  const cache = {
    users: {},
    user: {},
    projects: {},
    tasks: {},
    comments: {},
    ...JSON.parse(window.localStorage.getItem("cachedData") || "{}")
  };
  const dataToBeSent = cache.projects;
  if (Object.keys(dataToBeSent).length) {
    for (const projectID in dataToBeSent) {
      dataToBeSent[projectID].tasks = cache.tasks[projectID];
    }
    try {
      await API.graphql(graphqlOperation(mutations.importData, {
        data: JSON.stringify(dataToBeSent)
      }))
      window.localStorage.removeItem('projects')
    } catch (err) {
      console.error(err)
    }
  }
}