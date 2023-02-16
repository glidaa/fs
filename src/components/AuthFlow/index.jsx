import React, { useState, useEffect } from 'react';
import styles from "./index.module.scss"
import Login from './Login';
import NewAccount from './NewAccount';
import ForgotPassword from './ForgotPassword';
import Auth from "../../amplify/Auth"
import { ReactComponent as BackArrowIcon } from "@fluentui/svg-icons/icons/chevron_left_24_filled.svg";
import { navigate, useRouterNoUpdates } from '../Router';

const AuthFlow = () => {
  const [currPage, setCurrPage] = useState(<Login />);
  const { routeLocation } = useRouterNoUpdates();
  const handleGoBack = () => navigate(-1);
  useEffect(() => {
    const checkAuth = async () => {
      if (await Auth.isLoggedIn()) {
        navigate("/");
      }
    }
    checkAuth();
  }, [])
  useEffect(() => {
    switch (routeLocation) {
      case "/login":
        setCurrPage(<Login />)
        break
      case "/signup":
        setCurrPage(<NewAccount />)
        break
      case "/forgot-password":
        setCurrPage(<ForgotPassword />)
        break
      default:
        break
    }
  }, [routeLocation])
  return (
    <div className={`${styles.AuthFlowContainer} sleek-scrollbar`}>
      <button 
        className={[styles.backBtn, "noselect"].join(" ")}
        onClick={handleGoBack}
      >
        <BackArrowIcon fill="currentColor" />
        <span>Go back</span>
      </button>
      {currPage}
    </div>
  )
}

export default AuthFlow;