import React from 'react';
import { useState, useEffect } from "react"
import { Redirect } from "react-router-dom"
import { connect } from "react-redux"
import * as userActions from "../actions/user"
import * as appActions from "../actions/app"
import * as observersActions from "../actions/observers"
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { AmplifyAuthenticator, AmplifyContainer, AmplifySignUp } from "@aws-amplify/ui-react";

const Login = (props) => {
  const { dispatch } = props
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [referrer, setReferrer] = useState(null)
  useEffect(() => {
    setReferrer(props.route.location.state?.referrer)
    onAuthUIStateChange(async (nextAuthState, authData) => {
      dispatch(userActions.handleSetData(authData))
      dispatch(userActions.setState(nextAuthState))
      if (nextAuthState === AuthState.SignedIn) {
        //window.removeEventListener("storage", fetchLocalProjects)
        dispatch(observersActions.handleSetProjectsObservers())
        //migrateLocalTasks();
        dispatch(appActions.setLoading(true))
        setShouldRedirect(true)
      }
		});
  }, [])
  return (
    <>
      {shouldRedirect ? (
        <Redirect to={referrer || "/"} />
      ) : (
        <AmplifyContainer>
          <AmplifyAuthenticator usernameAlias="email">
            <AmplifySignUp headerText="Create a new account" formFields={[
              {
                label: "First Name",
                placeholder: "First Name",
                required: true,
                type: "given_name",
                custom: false
              },
              {
                label: "Last Name",
                placeholder: "Last Name",
                required: true,
                type: "family_name"
              },
              {
                label: "Username",
                placeholder: "Username",
                required: true,
                type: "username"
              },
              {
                label: "Password",
                placeholder: "Password",
                required: true,
                type: "password"
              },
              {
                label: "Email Address",
                placeholder: "Email Address",
                required: true,
                type: "email"
              },
              {
                label: "Phone Number",
                placeholder: "Phone Number",
                required: true,
                type: "phone_number"
              }
            ]} slot="sign-up" />
          </AmplifyAuthenticator>
        </AmplifyContainer>
      )}
    </>
  )
}

export default connect()(Login);