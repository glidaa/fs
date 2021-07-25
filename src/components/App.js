import React, { useEffect, useState } from "react";
import "../App.css";
import { connect } from "react-redux";
import Amplify, { PubSub } from "aws-amplify";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import * as projectsActions from "../actions/projects";
import * as notesActions from "../actions/notes";
import * as appActions from "../actions/app";
import * as userActions from "../actions/user";
import aws_exports from "../aws-exports";
import { Route, useHistory, useRouteMatch } from "react-router-dom";
import DetailsPanel from "./DetailsPanel";
import NotesPanel from "./NotesPanel";
import ProjectsPanel from "./ProjectsPanel"
import Loading from "./Loading";
import Login from "./Login";
import ActionSheet from "./ActionSheet"
Amplify.configure(aws_exports);
PubSub.configure(aws_exports);

const App = (props) => {
  const { dispatch, user, projects, app } = props;
  const history = useHistory();
  const routeMatch = useRouteMatch({
    exact: true,
    sensitive: true,
    path: [
      "/local/:projectPermalink",
      "/:username/:projectPermalink/:notePermalink",
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
      dispatch(userActions.handleSetData(authData));
      dispatch(userActions.setState(nextAuthState));
      if (nextAuthState === AuthState.SignedIn) {
        window.removeEventListener("storage", fetchLocalProjects);
      }
    });
    if (user.state !== AuthState.SignedIn) {
      window.addEventListener("storage", fetchLocalProjects);
    }
  }, []);
  useEffect(() => {
    if (routeMatch) {
      const {
        params: { username, projectPermalink, notePermalink },
      } = routeMatch;
      if (history.action === "POP") {
        if (!app.isLoading) {
          if (user.state === AuthState.SignedIn) {
            if (username && projectPermalink) {
              const allProjects = Object.values({
                ...projects.owned,
                ...projects.assigned,
              });
              const reqUserProjects = allProjects.filter(
                (x) => x.owner === username
              );
              if (reqUserProjects.length > 0) {
                const reqProject = reqUserProjects.filter(
                  (x) => x.permalink === projectPermalink
                )[0];
                if (reqProject) {
                  dispatch(appActions.handleSetProject(reqProject.id, false));
                  if (notePermalink) {
                    dispatch(notesActions.handleFetchNotes(reqProject.id)).then(
                      (notes) => {
                        const reqNote = Object.values(notes).filter(
                          (x) =>
                            x.permalink === parseInt(notePermalink, 10)
                        )[0];
                        if (reqNote) {
                          dispatch(appActions.handleSetNote(reqNote.id, false));
                        }
                      }
                    );
                  } else {
                    history.replace(`/${username}/${projectPermalink}`);
                  }
                } else {
                  history.replace("/");
                }
              } else {
                history.replace("/");
              }
            }
          } else {
            if (projectPermalink) {
              const reqProject = Object.values(projects.owned).filter(
                (x) => x.permalink === projectPermalink
              )[0];
              if (reqProject) {
                dispatch(appActions.handleSetProject(reqProject.id, false));
              } else {
                history.replace("/");
              }
            }
          }
        }
      }
    }
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
          "/:username/:projectPermalink/:notePermalink",
          "/:username/:projectPermalink",
          "/",
        ]}
        render={(routeProps) => (
          <>
            {app.isLoading ? (
              <Loading route={routeProps} />
            ) : (
              <div className="mainPage">
                <ActionSheet />
                <ProjectsPanel />
                <NotesPanel />
                <DetailsPanel
                  readOnly={
                    !Object.keys(projects.owned).includes(app.selectedProject)
                  }
                />
              </div>
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
  notes: state.notes,
  app: state.app,
}))(App);