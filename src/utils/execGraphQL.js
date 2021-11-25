import store from "../store";
import * as appActions from "../actions/app";
import { API } from "@aws-amplify/api";

export default (options) => {
  return new Promise((resolve, reject) => {
    if (!store.getState().app.isOffline) {
      API.graphql(options)
        .then(resolve)
        .catch((err) => {
          if (err.errors?.[0]?.message === "Network Error") {
            store.dispatch(appActions.setOffline(true));
          } else {
            console.error(err);
          }
          reject(err);
        });
    } else {
      reject({ errors: [{ message: "Network Error" }] });
    }
  });
};
