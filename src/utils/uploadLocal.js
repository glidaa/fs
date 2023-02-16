import * as cacheController from "../controllers/cache"
import { importLocalData } from "../graphql/mutations"
import API from '../amplify/API';

const uploadLocal = async () => {
  const localData = cacheController.getLocalData();
  if (localData) {
    try {
      await API.execute(importLocalData, { input: JSON.stringify(localData) });
      cacheController.deleteLocalData();
    } catch { /* empty */ }
  }
}

export default uploadLocal;
