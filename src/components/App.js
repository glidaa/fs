import React, { useEffect } from "react";
import { connect } from "react-redux";
import * as appActions from "../actions/app";
import * as appSettingsActions from "../actions/appSettings";
import { useNavigate, useRoutes } from "react-router-dom";
import AuthFlow from "./AuthFlow";
import Home from "./Home";
import isOnline from "../utils/isOnline";

const App = (props) => {
  const {
    app,
    appSettings,
    dispatch
  } = props;
  const navigate = useNavigate();

  const fetchAppSettings = () => {
    const fetchedSettings = window.localStorage.getItem("appSettings")
    if (fetchedSettings) {
      dispatch(appSettingsActions.importAppSettings(JSON.parse(fetchedSettings)))
    }
  }

  useEffect(() => {
    dispatch(appActions.setNavigate(navigate));
    window.addEventListener("storage", fetchAppSettings);
    const checkConnectionInterval = setInterval(async () => {
      const result = await isOnline();
      if (result && app.isOffline) {
        dispatch(appActions.setOffline(false));
      } else if (!result && !app.isOffline) {
        dispatch(appActions.setOffline(true));
      }
    }, 3000);
    return () => {
      clearInterval(checkConnectionInterval);
      window.removeEventListener("storage", fetchAppSettings)
    }
  }, []);

  useEffect(() => {
    document.documentElement.className = appSettings.theme + " " + (appSettings.isDarkMode ? "dark" : "light");
  }, [appSettings.theme, appSettings.isDarkMode]);
  return useRoutes([
    {
      caseSensitive: true,
      path: "/login",
      element: <AuthFlow />,
    },
    {
      caseSensitive: true,
      path: "/signup",
      element: <AuthFlow />,
    },
    {
      caseSensitive: true,
      path: "/forgot-password",
      element: <AuthFlow />,
    },
    {
      caseSensitive: true,
      path: "/local/:projectPermalink",
      element: <Home />,
    },
    {
      caseSensitive: true,
      path: "/:username/:projectPermalink/:taskPermalink",
      element: <Home />,
    },
    {
      caseSensitive: true,
      path: "/:username/:projectPermalink",
      element: <Home />,
    },
    {
      caseSensitive: true,
      path: "/",
      element: <Home />,
    },
  ])
};

export default connect((state) => ({
  app: state.app,
  appSettings: state.appSettings
}))(App);