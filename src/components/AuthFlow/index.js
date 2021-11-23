import React, { useState, useEffect } from 'react';
import styles from "./index.module.scss"
import { Navigate, useLocation } from "react-router-dom"
import { connect } from "react-redux"
import { Auth } from "@aws-amplify/auth";
import SimpleBar from 'simplebar-react';
import Login from './Login';
import NewAccount from './NewAccount';
import ForgotPassword from './ForgotPassword';
import isLoggedIn from '../../utils/isLoggedIn';

const AuthFlow = (props) => {
  const { dispatch } = props
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [referrer, setReferrer] = useState(null)
  const [currPage, setCurrPage] = useState(Login)
  const routeLocation = useLocation()
  useEffect(() => {
    setReferrer(routeLocation.state?.referrer)
    isLoggedIn().then(res => res && (
      Auth.currentAuthenticatedUser().then((authData) => {
        if (authData) {
          setShouldRedirect(true)
        }
      })
    ))
  }, [])
  useEffect(() => {
    switch (routeLocation?.pathname) {
      case "/login":
        setCurrPage(Login)
        break
      case "/signup":
        setCurrPage(NewAccount)
        break
      case "/forgot-password":
        setCurrPage(ForgotPassword)
        break
      default:
        break
    }
  }, [routeLocation?.pathname])
  return (
    <>
      {shouldRedirect ? (
        <Navigate to={referrer || "/"} />
      ) : (
        <SimpleBar className={styles.AuthFlowContainer}>
          {React.createElement(currPage, {setShouldRedirect, setCurrPage})}
        </SimpleBar>
      )}
    </>
  )
}

export default connect()(AuthFlow);