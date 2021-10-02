import React, { useEffect } from "react";
import { connect } from "react-redux";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import * as projectsActions from "../actions/projects";
import * as tasksActions from "../actions/tasks";
import * as appActions from "../actions/app";
import * as userActions from "../actions/user";
import aws_exports from "../aws-exports";
import * as queries from "../graphql/queries"
import { Route, useHistory, useRouteMatch } from "react-router-dom";
import TasksPanel from "./TasksPanel";
import Loading from "./Loading";
import Login from "./Login";
import Toolbar from "./Toolbar";
import ActionSheet from "./ActionSheet"
import SidePanel from "./SidePanel";

Amplify.configure(aws_exports);

const App = (props) => {
  const { dispatch, user, projects, app } = props;
  const history = useHistory();
  const routeMatch = useRouteMatch({
    exact: true,
    sensitive: true,
    path: [
      "/local/:projectPermalink",
      "/:username/:projectPermalink/:taskPermalink",
      "/:username/:projectPermalink",
      "/",
    ],
  });

  const fetchLocalProjects = () => {
    if (user.state !== AuthState.SignedIn) {
      dispatch(projectsActions.handleFetchOwnedProjects());
    }
  };

  useEffect(() => {
    dispatch(appActions.setHistory(history));
    onAuthUIStateChange(async (nextAuthState, authData) => {
      if (nextAuthState === AuthState.SignedIn) {
        const userData = (await API.graphql(
          graphqlOperation(
            queries.getUserByUsername, {
              username: authData.username
            }
          )
        )).data.getUserByUsername
        dispatch(userActions.handleSetData(userData))
        dispatch(userActions.handleSetState(AuthState.SignedIn))
      } else {
        dispatch(userActions.handleSetData(null))
        dispatch(userActions.handleSetState(nextAuthState))
      }
      if (nextAuthState === AuthState.SignedIn) {
        window.removeEventListener("storage", fetchLocalProjects);
      }
    })
    if (user.state !== AuthState.SignedIn) {
      window.addEventListener("storage", fetchLocalProjects);
    }
  }, []);

  useEffect(() => {
    (async () => {
    if (routeMatch && history.action === "POP" && !app.isLoading) {
      const {
        params: { username, projectPermalink, taskPermalink },
      } = routeMatch;
      if (user.state === AuthState.SignedIn && username && projectPermalink) {
        let reqProject = Object.values(projects).filter(x => x.permalink === `${username}/${projectPermalink}`)[0]
        if (!reqProject) {
          try {
            reqProject = (await API.graphql(graphqlOperation(queries.getProjectByPermalink, {
              permalink: `${username}/${projectPermalink}`
            }))).data.getProjectByPermalink
            dispatch(projectsActions.createProject(reqProject, "temp"))
          } catch {
            reqProject = null
            if (taskPermalink) {
              history.replace(`/${username}/${projectPermalink}`)
            }
          }
        }
        if (reqProject) {
          dispatch(appActions.handleSetProject(reqProject.id, false));
          if (taskPermalink) {
            const tasks = await dispatch(tasksActions.handleFetchTasks(reqProject.id))
            const reqTask = Object.values(tasks).filter(x => x.permalink === parseInt(taskPermalink, 10))[0]
            if (reqTask) {
              dispatch(appActions.handleSetTask(reqTask.id, false));
            }
          } else {
            history.replace(`/${username}/${projectPermalink}`);
          }
        }
      } else if (user.state !== AuthState.SignedIn && projectPermalink) {
        const reqProject = Object.values(projects).filter((x) => x.permalink === projectPermalink)[0];
        if (reqProject) {
          dispatch(appActions.handleSetProject(reqProject.id, false));
        }
      }
    }
    })()
  }, [routeMatch, app, user]);
  return (
    <div className="App">
      <Route
        exact
        path="/login"
        render={(routeProps) => <Login route={routeProps} />}
      />
      <Route
        exact
        sensitive
        path={[
          "/local/:projectPermalink",
          "/:username/:projectPermalink/:taskPermalink",
          "/:username/:projectPermalink",
          "/",
        ]}
        render={(routeProps) => (
          <>
            {app.isLoading ? (
              <Loading route={routeProps} />
            ) : (
              <>
              <ActionSheet />
              <Toolbar />
              <div className="mainPage">
                <SidePanel isRight={false} />
                <TasksPanel />
                <SidePanel isRight={true} />
              </div>
              </>
            )}
          </>
        )}
      />
    </div>
  );
};

export default connect((state) => ({
  user: state.user,
  projects: state.projects,
  app: state.app,
}))(App);