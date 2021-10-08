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
import "../assets/styles/loginContainer.css";

const Login = (props) => {
  const { dispatch } = props
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [referrer, setReferrer] = useState(null)
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
        <div className="loginContainer">
          <Signup signup="signup" login="Log in to account" email="Enter your email address" password="Create your password" passwordTwo="Confirm your password">
          Signup for Forwardslash
          </Signup>
        </div>
      )}
    </>
  )
}

export default connect()(Login);