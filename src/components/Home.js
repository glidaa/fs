import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { graphqlOperation } from "@aws-amplify/api";
import { AuthState } from "../constants";
import * as projectsActions from "../actions/projects";
import * as tasksActions from "../actions/tasks";
import * as appActions from "../actions/app";
import * as queries from "../graphql/queries"
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styles from "./Home.module.scss"
import TasksPanel from "./TasksPanel";
import Loading from "./Loading";
import Toolbar from "./Toolbar";
import ActionSheet from "./ActionSheet"
import SidePanel from "./SidePanel";
import Notifications from "./Notifications";
import execGraphQL from "../utils/execGraphQL";
import SyncManager from "./SyncManager";

const Home = (props) => {
  const {
    app,
    user,
    projects,
    dispatch
  } = props;
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const routeParams = useParams();
  const routeLocation = useLocation();

  const fetchLocalProjects = () => {
    if (user.state !== AuthState.SignedIn) {
      dispatch(projectsActions.handleFetchOwnedProjects());
    }
  };

  useEffect(() => {
    if (user.state === AuthState.SignedIn) {
      window.removeEventListener("storage", fetchLocalProjects)
    } else {
      window.addEventListener("storage", fetchLocalProjects);
    }
    return () => {
      window.removeEventListener("storage", fetchLocalProjects)
    }
  }, [user.state]);

  useEffect(() => {
    (async () => {
    if (routeParams && !app.isLoading) {
      const {
        username, projectPermalink, taskPermalink
      } = routeParams;
      if (user.state === AuthState.SignedIn && username && projectPermalink) {
        let reqProject = Object.values(projects).filter(x => x.permalink === `${username}/${projectPermalink}`)[0]
        if (!reqProject) {
          try {
            reqProject = (await execGraphQL(graphqlOperation(queries.getProjectByPermalink, {
              permalink: `${username}/${projectPermalink}`
            }))).data.getProjectByPermalink
            dispatch(projectsActions.createProject(reqProject, "temp"))
          } catch {
            reqProject = null
            if (taskPermalink) {
              navigate(`/${username}/${projectPermalink}`, { replace: true })
            }
          }
        }
        if (reqProject) {
          const prevSelectedProject = app.selectedProject
          dispatch(appActions.handleSetProject(reqProject.id, false));
          if (taskPermalink) {
            const tasks = prevSelectedProject === app.selectedProject ?
              props.tasks : await dispatch(tasksActions.handleFetchTasks(reqProject.id, true))
            const reqTask = Object.values(tasks).filter(x => x.permalink === parseInt(taskPermalink, 10))[0]
            if (reqTask) {
              dispatch(appActions.handleSetTask(reqTask.id, false));
            }
          } else {
            navigate(`/${username}/${projectPermalink}`, { replace: true });
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
  }, [routeLocation, app.isLoading, user]);
  return (
    <div>
      <Notifications />
      {isLoading ? (
        <Loading onFinish={() => setIsLoading(false)} />
      ) : (
				<>
          <SyncManager />
					<ActionSheet />
					<Toolbar />
					<div className={styles.MainPage}>
						<SidePanel isRight={false} />
						<TasksPanel />
						<SidePanel isRight={true} />
					</div>
				</>
      )}
    </div>
  );
};

export default connect((state) => ({
  app: state.app,
  user: state.user,
  tasks: state.tasks,
  projects: state.projects
}))(Home);