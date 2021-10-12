import React from 'react';
import styled from "styled-components"
import { useState } from "react"
import { connect } from "react-redux"
import { Auth } from "aws-amplify";
import * as userActions from "../../actions/user"
import * as appActions from "../../actions/app"
import { AuthState } from '../../constants';
import { useHistory } from 'react-router-dom';
import SubmitBtn from '../UI/fields/SubmitBtn';
import TextField from '../UI/fields/TextField';

const Login = (props) => {
  const { setShouldRedirect, dispatch } = props
  const [verificationCode, setVerificationCode] = useState("")
  const [currStep, setCurrStep] = useState(0)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [usernameError, setUsernameError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [verificationCodeError, setVerificationCodeError] = useState(null)
  const [isBusy, setIsBusy] = useState(false)
  const history = useHistory();
  const handleLogin = async (e) => {
    e.preventDefault()
    setIsBusy(true)
    setUsernameError(null)
    setPasswordError(null)
    try {
      await Auth.signIn(username, password);
      dispatch(appActions.setLoading(true))
      setShouldRedirect(true)
    } catch (error) {
      console.log('error signing in', error);
      switch(error.code) {
        case "UserNotFoundException":
          setUsernameError("User does not exist.")
          break
        case "NotAuthorizedException":
          setPasswordError("Password is incorrect.")
          break
        case "UserNotConfirmedException":
          setCurrStep(1)
          setIsBusy(false)
          break
        default:
          break
      }
      setIsBusy(false)
      dispatch(userActions.handleSetData(null))
      dispatch(userActions.handleSetState(AuthState.SignedOut))
    }
  }
  const handleConfirmAccount = async (e) => {
    e.preventDefault()
    setVerificationCodeError(null)
    setIsBusy(true)
    try {
      await Auth.confirmSignUp(username, verificationCode)
      await Auth.signIn(username, password);
      dispatch(appActions.setLoading(true))
      setShouldRedirect(true)
    } catch (error) {
      console.log('error signing in', error);
      switch (error.code) {
        case "CodeMismatchException":
          setVerificationCodeError("Code is incorrect. Please check the code sent to your email and try again.")
          break
        default:
          setVerificationCodeError("An unexpected error occured.")
          break
      }
      setIsBusy(false)
    }
  }
  
  const handleChange = ({ target: { name, value } }) => {
    switch (name) {
      case "username":
        setUsername(value)
        setUsernameError(null)
        break
      case "password":
        setPassword(value)
        setPasswordError(null)
        break
      case "verificationCode":
        setVerificationCode(value)
        setVerificationCodeError(null)
        break
      default:
        break
    }
  }
  return currStep === 0 ? (
    <LoginFormContainer>
      <LoginFormHeader>
        <span>Login</span>
      </LoginFormHeader>
      <LoginStepOneForm onSubmit={handleLogin}>
        <TextField
          type="text"
          name="username"
          label="Username"
          placeholder="username…"
          autoComplete="username"
          onChange={handleChange}
          error={usernameError}
          value={username}
        />
        <TextField
          type="password"
          label="Password"
          name="password"
          placeholder="password…"
          autoComplete="current-password"
          onChange={handleChange}
          error={passwordError}
          value={password}
        />
        <NewAccountLink onClick={() => history.push("/signup")}>
          <span>No Account? </span>
          <span>Create One</span>
        </NewAccountLink>
        <ForgotPasswordLink onClick={() => history.push("/forgot-password")}>
          Forgot Password?
        </ForgotPasswordLink>
        <SubmitBtn
          type="submit"
          value={isBusy ? "Signing In" : "Sign In"}
          disabled={isBusy || !username.trim() || !password.trim()}
        />
      </LoginStepOneForm>
    </LoginFormContainer>
  ) : (
    <LoginFormContainer>
      <LoginFormHeader>
        <span>Confirm Account</span>
        <span>Enter code sent to your email.</span>
      </LoginFormHeader>
      <LoginStepTwoForm onSubmit={handleConfirmAccount}>
        <TextField
          type="text"
          label="Verification Code"
          name="verificationCode"
          placeholder="Code…"
          onChange={handleChange}
          error={verificationCodeError}
          value={verificationCode}
        />
        <SubmitBtn
          type="submit"
          style={{width: "100%"}}
          value={isBusy ? "Processing" : "Submit"}
          disabled={isBusy || !verificationCode.trim()}
        />
      </LoginStepTwoForm>
    </LoginFormContainer>
  )
}

const LoginFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 40px 0;
  justify-content: center;
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.75);
  box-shadow: rgb(99 99 99 / 20%) 0px 2px 8px 0px;
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

const LoginFormHeader = styled.div`
  display: flex;
  flex-direction: column;
  color: #000000;
  & > span:nth-child(1) {
    font-weight: 600;
    font-size: 24px;
  }
  & > span:nth-child(2) {
    font-weight: 400;
    font-size: 16px;
  }
`

const LoginStepOneForm = styled.form`
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
`;

const LoginStepTwoForm = styled.form`
  display: grid;
  grid-template-areas:
    'code code'
    'submit submit';
  gap: 15px;
  align-items: start;
  & > *:nth-child(1) {
    grid-area: code;
  }
  & > *:nth-child(2) {
    grid-area: submit;
  }
`;

const NewAccountLink = styled.div`
  font-size: 14px;
  justify-self: flex-start;
  cursor: pointer;
  & > span:nth-child(2) {
    color: var(--primary);
  }
`

const ForgotPasswordLink = styled.span`
  font-size: 14px;
  justify-self: flex-end;
  color: var(--primary);
  cursor: pointer;
  &:hover {

  }
`

export default connect()(Login);