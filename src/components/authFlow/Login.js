import React from 'react';
import styledComponents from "styled-components"
import { useState } from "react"
import { connect } from "react-redux"
import { Auth } from "aws-amplify";
import * as userActions from "../../actions/user"
import * as appActions from "../../actions/app"
import { AuthState } from '../../constants';
import { useHistory } from 'react-router';

const Login = (props) => {
  const { setShouldRedirect, dispatch } = props
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const history = useHistory();
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
    <LoginFormContainer>
      <LoginFormHeader>
        <span>Login</span>
      </LoginFormHeader>
      <LoginForm onSubmit={handleLogin}>
        <LoginFormEntry>
          <label htmlFor="username">
            Username
          </label>
          <input
            type="text"
            name="username"
            placeholder="username…"
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          ></input>
        </LoginFormEntry>
        <LoginFormEntry>
          <label htmlFor="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="password…"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          ></input>
        </LoginFormEntry>
        <NewAccountLink onClick={() => history.push("/signup")}>
          <span>No Account? </span>
          <span>Create One</span>
        </NewAccountLink>
        <ForgotPasswordLink onClick={() => history.push("/forgot-password")}>
          Forgot Password?
        </ForgotPasswordLink>
        <input type="submit" value="Sign In" />
      </LoginForm>
    </LoginFormContainer>
  )
}

const LoginFormContainer = styledComponents.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 40px 0;
  justify-content: center;
  background-color: #FFFFFF;
  border-radius: 25px;
  height: fit-content;
  width: 350px;
  padding: 35px;
  @media only screen and (max-width: 768px) {
    position: absolute;
    width: calc(100% - 70px);
    height: calc(100% - 70px);
    border-radius: 0;
    margin: 0;
  }
`

const LoginFormHeader = styledComponents.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: #222222;
  & > span:nth-child(1) {
    font-weight: 600;
    font-size: 24px;
  }
  & > span:nth-child(2) {
    font-weight: 400;
    font-size: 16px;
  }
`

const LoginForm = styledComponents.form`
  display: grid;
  grid-template-areas:
    'username username'
    'password password'
    'newAccount ForgotPassword'
    'signIn signIn';
  gap: 15px;
  & > *:nth-child(1) {
    grid-area: username;
  }
  & > *:nth-child(2) {
    grid-area: password;
  }
  & > *:nth-child(3) {
    grid-area: newAccount;
  }
  & > *:nth-child(4) {
    grid-area: ForgotPassword;
  }
  & > *:nth-child(5) {
    grid-area: signIn;
  }
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
    font-size: 14px;
    font-weight: 600;
  }
  & > input {
    width: calc(100% - 20px);
    padding: 5px 10px;
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

const NewAccountLink = styledComponents.div`
  font-size: 14px;
  justify-self: flex-start;
  cursor: pointer;
  & > span:nth-child(2) {
    color: #006EFF;
  }
`

const ForgotPasswordLink = styledComponents.span`
  font-size: 14px;
  justify-self: flex-end;
  color: #006EFF;
  cursor: pointer;
  &:hover {

  }
`

export default connect()(Login);