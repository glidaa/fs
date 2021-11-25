import React, { useEffect } from "react";
import { connect } from "react-redux";
import * as appActions from "../actions/app";
import * as appSettingsActions from "../actions/appSettings";
import { useNavigate, useRoutes } from "react-router-dom";
import AuthFlow from "./AuthFlow";
import Home from "./Home";
import store from "../store";
import isOnline from "../utils/isOnline";

const App = (props) => {
  const {
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

  const checkReloadAbility = (e) => {
    e.preventDefault();
    if (store.getState().mutations.length > 0) {
      e.returnValue = "Dude, are you sure you want to leave? Think of the kittens!";
    } else {
      delete e['returnValue'];
    }
  }

  useEffect(() => {
    dispatch(appActions.setNavigate(navigate));
    window.addEventListener("storage", fetchAppSettings);
    window.addEventListener("beforeunload", checkReloadAbility);
    const checkConnectionInterval = setInterval(async () => {
      const result = await isOnline();
      const { app: { isOffline }} = store.getState()
      if (result && isOffline) {
        store.dispatch(appActions.setOffline(false));
      } else if (!result && !isOffline) {
        store.dispatch(appActions.setOffline(true));
      }
    }, 3000);
    return () => {
      clearInterval(checkConnectionInterval);
      window.removeEventListener("storage", fetchAppSettings)
      window.removeEventListener("beforeunload", checkReloadAbility);
    }
  }, []);

  useEffect(() => {
    const availColors = {
      "red": "#FB1515",
      "rose": "#FF969C",
      "orange": "#FE6000",
      "green": "#15fb3b",
      "turquoise": "#15fbd9",
      "cyan": "#15dcfb",
      "blue": "#1560FB",
      "pink": "#fb15b2",
      "purple": "#5615fb",
      "black": "#000000",
    }
    document.documentElement.className = appSettings.theme + " " + (appSettings.isDarkMode ? "dark" : "light");
    document.querySelector('meta[name="theme-color"]').setAttribute('content', availColors[appSettings.theme])
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
  appSettings: state.appSettings
}))(App);