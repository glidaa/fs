import React from 'react';
import styles from "./Login.module.scss"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as userActions from "../../actions/user"
import * as cacheController from "../../controllers/cache"
import TextField from '../UI/fields/TextField';
import Auth from '../../amplify/Auth';
import { navigate } from '../Router';
import Button from '../UI/Button';

const Login = () => {
  const [verificationCode, setVerificationCode] = useState("")
  const [currStep, setCurrStep] = useState(0)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [usernameError, setUsernameError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [verificationCodeError, setVerificationCodeError] = useState(null)
  const [isBusy, setIsBusy] = useState(false)
  const dispatch = useDispatch()
  const isOffline = useSelector(state => state.app.isOffline)
  const handleLogin = async (e) => {
    e.preventDefault()
    setIsBusy(true)
    setUsernameError(null)
    setPasswordError(null)
    try {
      await Auth.signIn(username, password);
      cacheController.resetCache(true)
      navigate("/");
    } catch (error) {
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
      dispatch(userActions.handleSignOut())
    }
  }
  const handleConfirmAccount = async (e) => {
    e.preventDefault()
    setVerificationCodeError(null)
    setIsBusy(true)
    try {
      await Auth.confirmSignUp(username, verificationCode)
      await Auth.signIn(username, password);
      navigate("/");
    } catch (error) {
      console.error('error signing in', error);
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
        <span>forwardslash</span>
        <span>User Login</span>
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
          onClick={() => navigate("/signup")}
        >
          <span>No Account? </span>
          <span>Create One</span>
        </div>
        <span
          className={styles.ForgotPasswordLink}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </span>
        <Button
          type="submit"
          fullWidth
          label={isBusy ? "Signing In" : "Sign In"}
          disabled={isBusy || !username.trim() || !password.trim()}
        />
      </form>
    </div>
  ) : (
    <div className={styles.LoginFormContainer}>
      <div className={styles.LoginFormHeader}>
        <span>forwardslash</span>
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
        <Button
          type="submit"
          fullWidth
          label={isBusy ? "Processing" : isOffline ? "No Connection!" : "Submit"}
          disabled={isBusy || !verificationCode.trim() || isOffline}
        />
      </form>
    </div>
  )
}

export default Login;