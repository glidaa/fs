import { graphqlOperation } from "@aws-amplify/api";
import * as cacheController from "../controllers/cache"
import * as mutations from "../graphql/mutations"
import execGraphQL from "./execGraphQL";

export default async () => {
  const { localCache } = cacheController.getCache()
  if (localCache) {
    const dataToBeSent = Object.values(localCache.projects);
    if (dataToBeSent.length) {
      for (const [index, project] of [...dataToBeSent].entries()) {
        dataToBeSent[index].tasks = Object.values(localCache.tasks[project.id] || {});
      }
      try {
        await execGraphQL(graphqlOperation(mutations.importData, {
          data: JSON.stringify(dataToBeSent)
        }))
        cacheController.deleteLocalCache()
      } catch (err) {
        console.error(err)
      }
    }
  }
}