import React from 'react';
import styledComponents from "styled-components"
import { useState, useEffect } from "react"
import { Redirect } from "react-router-dom"
import { connect } from "react-redux"
import { API, graphqlOperation, Auth } from "aws-amplify";
import * as userActions from "../actions/user"
import * as appActions from "../actions/app"
import * as queries from "../graphql/queries"
import * as observersActions from "../actions/observers"
import { ReactComponent as GoogleLogo } from "../assets/google-logo.svg"
import TasksIllustartion from "../assets/oleg-chursin-vaPoJZB9Mzg-unsplash.jpg"
import { AuthState } from '@aws-amplify/ui-components';

const Login = (props) => {
  const { dispatch } = props
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [referrer, setReferrer] = useState(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  useEffect(() => {
    setReferrer(props.route.location.state?.referrer)
    Auth.currentUserInfo().then((authData) => {
      if (authData) {
        dispatch(appActions.setLoading(true))
        setShouldRedirect(true)
      }
    })
  }, [])
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await Auth.signIn(username, password);
      dispatch(appActions.setLoading(true))
      setShouldRedirect(true)
    } catch (error) {
      console.log('error signing in', error);
      dispatch(userActions.handleSetData(null))
      dispatch(userActions.handleSetState(AuthState.SignedOut))
    }
  }
  return (
    <>
      {shouldRedirect ? (
        <Redirect to={referrer || "/"} />
      ) : (
        <LoginContainer>
          <LoginFormContainer>
            <LoginFormHeader>
              <span>Login</span>
            </LoginFormHeader>
            <LoginWithGoogleBtn>
              <GoogleLogo height={18} />
              <span>Sign in with Google</span>
            </LoginWithGoogleBtn>
            <LoginWithEmailHeader>
              or Sign in with Email
            </LoginWithEmailHeader>
            <LoginForm onSubmit={handleLogin}>
              <LoginFormEntry>
              <label htmlFor="username">
                Username*
              </label>
              <input
                type="test"
                name="username"
                placeholder="username…"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              ></input>
              </LoginFormEntry>
              <LoginFormEntry>
              <label htmlFor="password">
                Password*
              </label>
              <input
                type="password"
                name="password"
                placeholder="password…"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              ></input>
              </LoginFormEntry>
              <input type="submit" value="Sign In" />
            </LoginForm>
          </LoginFormContainer>
        </LoginContainer>
      )}
    </>
  )
}

const LoginContainer = styledComponents.div`
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url(${TasksIllustartion});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
`

const LoginFormContainer = styledComponents.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  background-color: #FFFFFF;
  border-radius: 25px;
  height: fit-content;
  max-height: calc(100% - 90px);
  width: 350px;
  padding: 45px;
  @media only screen and (max-width: 768px) {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
`

const LoginFormHeader = styledComponents.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: #222222;
  & > span:nth-child(1) {
    font-weight: 600;
    font-size: 28px;
  }
  & > span:nth-child(2) {
    font-weight: 400;
    font-size: 16px;
  }
`

const LoginForm = styledComponents.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  & > h2 > span {
    cursor: pointer;
  }
  & > input[type="submit"] {
    width: 100%;
    padding: 15px 0;
    background-color: #006EFF;
    color: #FFFFFF;
    border-radius: 8px;
    outline: none;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s linear;
    &:hover {
      background-color: #0058cc;
    }
    &:disabled {
      background-color: #338bff;
    }
  }
`;

const LoginFormEntry = styledComponents.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: 0 0;
  gap: 5px;
  & > label {
    color: #222222;
    margin-bottom: 0;
    width: max-content;
    font-size: 16px;
    font-weight: 600;
  }
  & > input {
    width: calc(100% - 20px);
    padding: 10px 10px;
    border: 1px solid #C0C0C0;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 400;
    &:disabled {
      background-color: #FAFAFA;
    }
    &::placeholder {
      color: #C0C0C0;
    }
  }
`

const LoginWithGoogleBtn = styledComponents.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: #222222;
  cursor: pointer;
  outline: none;
  background-color: #FFFFFF;
  padding: 10px 0;
  border: 1px solid #C0C0C0;
  width: 100%;
  font-weight: 600;
  font-size: 14px;
  border-radius: 8px;
`

const LoginFormAd = styledComponents.div`
  flex: 1;
  height: 100%;
`

const LoginWithEmailHeader = styledComponents.span`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #C0C0C0;
  &::after, &::before {
    content: '';
    flex: 1;
    height: 1px;
    background-color: #C0C0C0;
  }
  &::before {
    margin-right: 1rem;
  }
  &::after {
    margin-left: 1rem;
  }
`

export default connect()(Login);

// const Login = (props) => {
//   const { dispatch } = props
//   const [shouldRedirect, setShouldRedirect] = useState(false)
//   const [referrer, setReferrer] = useState(null)
//   useEffect(() => {
//     setReferrer(props.route.location.state?.referrer)
//     onAuthUIStateChange(async (nextAuthState, authData) => {
//       if (nextAuthState === AuthState.SignedIn) {
//         const userData = (await API.graphql(
//           graphqlOperation(
//             queries.getUserByUsername, {
//               username: authData.username
//             }
//           )
//         )).data.getUserByUsername
//         dispatch(userActions.handleSetData(userData))
//         dispatch(userActions.handleSetState(AuthState.SignedIn))
//         dispatch(observersActions.handleSetProjectsObservers())
//         dispatch(appActions.setLoading(true))
//         setShouldRedirect(true)
//       } else {
//         dispatch(userActions.handleSetData(null))
//         dispatch(userActions.handleSetState(nextAuthState))
//       }
// 		});
//   }, [])
//   return (
//     <>
//       {shouldRedirect ? (
//         <Redirect to={referrer || "/"} />
//       ) : (
//         <AmplifyContainer>
//           <AmplifyAuthenticator>
//             <AmplifySignUp headerText="Create a new account" formFields={[
//               {
//                 label: "First Name",
//                 placeholder: "First Name",
//                 required: true,
//                 type: "given_name",
//                 custom: false
//               },
//               {
//                 label: "Last Name",
//                 placeholder: "Last Name",
//                 required: true,
//                 type: "family_name"
//               },
//               {
//                 label: "Username",
//                 placeholder: "Username",
//                 required: true,
//                 type: "username"
//               },
//               {
//                 label: "Password",
//                 placeholder: "Password",
//                 required: true,
//                 type: "password"
//               },
//               {
//                 label: "Email Address",
//                 placeholder: "Email Address",
//                 required: true,
//                 type: "email"
//               },
//               {
//                 label: "Phone Number",
//                 placeholder: "Phone Number",
//                 required: true,
//                 type: "phone_number"
//               }
//             ]} slot="sign-up" />
//           </AmplifyAuthenticator>
//         </AmplifyContainer>
//       )}
//     </>
//   )
// }

// export default connect()(Login);