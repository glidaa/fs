import React from 'react';
import { useState, useEffect } from "react"
import { Redirect } from "react-router-dom"
import { connect } from "react-redux"
import { API, graphqlOperation } from "aws-amplify";
import * as userActions from "../actions/user"
import * as appActions from "../actions/app"
import * as queries from "../graphql/queries"
import * as observersActions from "../actions/observers"
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { AmplifyAuthenticator, AmplifyContainer, AmplifySignUp } from "@aws-amplify/ui-react";
import Signup from "../componentStories/Signup/Signup"
import LoginAccount from "../componentStories/Login/Login"
import "../assets/styles/loginContainer.css";

const Login = (props) => {
  const { dispatch } = props
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [referrer, setReferrer] = useState(null)
  const [isLogin, setOnLogin] = useState(false);
  useEffect(() => {
    setReferrer(props.route.location.state?.referrer)
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
        dispatch(observersActions.handleSetProjectsObservers())
        dispatch(appActions.setLoading(true))
        setShouldRedirect(true)
      } else {
        dispatch(userActions.handleSetData(null))
        dispatch(userActions.handleSetState(nextAuthState))
      }
		});
  }, [])
  return (
    <>
      {shouldRedirect ? (
        <Redirect to={referrer || "/"} />
      ) : (
        isLogin?
          <div className="loginContainer">
            <LoginAccount login="Login" resetPassword="Reset password" email="Enter your email address" password="Create your     password" createAccount="Create account" onClick={() => setOnLogin(false)}>
                Log in to your Account
              </LoginAccount>
          </div>
          :
          <div className="loginContainer">
            <Signup signup="signup" login="Log in to account" email="Enter your email address" password="Create your password" passwordTwo="Confirm your password" onClick={() => setOnLogin(true)}>
              Signup for Forwardslash
            </Signup>
        </div>
        )
      }
    </>
  )
}

export default connect()(Login);

/*
        <div className="loginContainer">
          <Signup signup="signup" login="Log in to account" email="Enter your email address" password="Create your password" passwordTwo="Confirm your password">
          Signup for Forwardslash
          </Signup>
        </div>
*/