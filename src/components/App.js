import React, { useEffect } from "react";
import { connect } from "react-redux";
import * as appActions from "../actions/app";
import * as appSettingsActions from "../actions/appSettings";
import { useNavigate, useRoutes } from "react-router-dom";
import AuthFlow from "./AuthFlow";
import Home from "./Home";

const App = (props) => {
  const {
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
    return () => {
      window.removeEventListener("storage", fetchAppSettings)
    }
  }, []);
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

export default connect()(App);