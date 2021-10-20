import React from 'react';
import styles from "./Login.module.scss"
import { useState } from "react"
import { connect } from "react-redux"
import { Auth } from "@aws-amplify/auth";
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
    <div className={styles.LoginFormContainer}>
      <div className={styles.LoginFormHeader}>
        <span>Login</span>
      </div>
      <form
        className={styles.LoginStepOneForm}
        onSubmit={handleLogin}
      >
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
        <div
          className={styles.NewAccountLink}
          onClick={() => history.push("/signup")}
        >
          <span>No Account? </span>
          <span>Create One</span>
        </div>
        <span
          className={styles.ForgotPasswordLink}
          onClick={() => history.push("/forgot-password")}
        >
          Forgot Password?
        </span>
        <SubmitBtn
          type="submit"
          value={isBusy ? "Signing In" : "Sign In"}
          disabled={isBusy || !username.trim() || !password.trim()}
        />
      </form>
    </div>
  ) : (
    <div className={styles.LoginFormContainer}>
      <div className={styles.LoginFormHeader}>
        <span>Confirm Account</span>
        <span>Enter code sent to your email.</span>
      </div>
      <form
        className={styles.LoginStepTwoForm}
        onSubmit={handleConfirmAccount}
      >
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
      </form>
    </div>
  )
}

export default connect()(Login);