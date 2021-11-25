import React from 'react';
import styles from "./ForgotPassword.module.scss"
import { useState } from "react"
import { connect } from "react-redux"
import { Auth } from "@aws-amplify/auth";
import SubmitBtn from '../UI/fields/SubmitBtn';
import TextField from '../UI/fields/TextField';

const ForgotPassword = (props) => {
  const { app: { isOffline }, setShouldRedirect } = props
  const [username, setUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [usernameError, setUsernameError] = useState(null)
  const [newPasswordError, setNewPasswordError] = useState(null)
  const [verificationCodeError, setVerificationCodeError] = useState(null)
  const [currStep, setCurrStep] = useState(0)
  const [isBusy, setIsBusy] = useState(false)
  const initiatePasswordRecovery = async (e) => {
    e.preventDefault()
    setUsernameError(null)
    setIsBusy(true)
    try {
      await Auth.forgotPassword(username)
      setCurrStep(2)
      setIsBusy(false)
    } catch (error) {
      console.log('error signing in', error);
      switch (error.code) {
        case "InvalidParameterException":
          setCurrStep(1)
          break
        case "UserNotFoundException":
          setUsernameError("User does not exist.")
          break
        default:
          break
      }
      setIsBusy(false)
    }
  }
  const confirmAccount = async (e) => {
    e.preventDefault()
    setVerificationCodeError(null)
    setIsBusy(true)
    try {
      await Auth.confirmSignUp(username, verificationCode)
      await Auth.forgotPassword(username)
      setVerificationCode("")
      setCurrStep(2)
      setIsBusy(false)
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
  const validateNewPassword = (value = newPassword) => {
    setNewPasswordError(null)
    if (value.length < 8) {
      setNewPasswordError("Password must contain at least 8 characters.")
      return
    }
    const re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*`~\-<>,./+_=()[\]\\]).{8,}$/;
    const isValid = re.test(value)
    if (!isValid) setNewPasswordError("Password must contain lowercase, uppercase, numerical and symbolic characters.")
  }
  const completePasswordRecovery = async (e) => {
    e.preventDefault()
    setVerificationCodeError(null)
    setIsBusy(true)
    try {
      await Auth.forgotPasswordSubmit(username, verificationCode, newPassword)
      await Auth.signIn(username, newPassword)
      setShouldRedirect(true)
    } catch (error) {
      console.log('error signing in', error);
      switch (error.code) {
        case "CodeMismatchException":
          setVerificationCodeError("Code is incorrect. Please check the code sent to your email and try again.")
          break
        default:
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
      case "newPassword":
        setNewPassword(value)
        validateNewPassword(value)
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
    <div className={styles.ForgotPasswordFormContainer}>
      <div className={styles.ForgotPasswordFormHeader}>
        <span>forwardslash</span>
        <span>Forgot Password?</span>
      </div>
      <form
        className={styles.ForgotPasswordForm}
        onSubmit={initiatePasswordRecovery}
      >
        <TextField
          type="test"
          label="Username"
          name="username"
          placeholder="username…"
          autoComplete="username"
          onChange={handleChange}
          error={usernameError}
          value={username}
        />
        <SubmitBtn
          type="submit"
          value={isBusy ? "Processing" : "Next"}
          disabled={isBusy || !username.trim()}
        />
      </form>
    </div>
  ) : currStep === 1 ? (
    <div className={styles.ForgotPasswordFormContainer}>
      <div className={styles.ForgotPasswordFormHeader}>
        <span>forwardslash</span>
        <span>Confirm Account First</span>
        <span>Enter code sent to your email.</span>
      </div>
      <form
        className={styles.ForgotPasswordForm}
        onSubmit={confirmAccount}
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
          value={isBusy ? "Processing" : "Next"}
          disabled={isBusy || !verificationCode.trim()}
        />
      </form>
    </div>
  ) : (
    <div className={styles.ForgotPasswordFormContainer}>
      <div className={styles.ForgotPasswordFormHeader}>
        <span>forwardslash</span>
        <span>Forgot Password?</span>
      </div>
      <form
        className={styles.ForgotPasswordForm}
        onSubmit={completePasswordRecovery}
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
        <TextField
          type="password"
          name="newPassword"
          label="New Password"
          placeholder="Password…"
          autoComplete="new-password"
          onChange={handleChange}
          error={newPasswordError}
          value={newPassword}
        />
        <SubmitBtn
          type="submit"
          style={{width: "100%"}}
          value={isBusy ? "Processing" : isOffline ? "No Connection!" : "Submit"}
          disabled={isBusy || !verificationCode.trim() || !newPassword.trim() || newPasswordError || isOffline}
        />
      </form>
    </div>
  )
}
export default connect((state) => ({
  app: state.app
}))(ForgotPassword);