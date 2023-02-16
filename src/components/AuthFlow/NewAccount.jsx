import React, { useMemo } from 'react';
import styles from "./NewAccount.module.scss"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as userActions from "../../actions/user"
import * as cacheController from "../../controllers/cache"
import { AuthState } from '../../constants';
import TextField from '../UI/fields/TextField';
import Auth from '../../amplify/Auth';
import { navigate } from '../Router';
import Button from '../UI/Button';

const NewAccount = () => {
  const [verificationCode, setVerificationCode] = useState("")
  const [currStep, setCurrStep] = useState(0)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [firstNameError, setFirstNameError] = useState(null)
  const [lastNameError, setLastNameError] = useState(null)
  const [usernameError, setUsernameError] = useState(null)
  const [emailError, setEmailError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [verificationCodeError, setVerificationCodeError] = useState(null)
  const [isBusy, setIsBusy] = useState(false)
  const dispatch = useDispatch()
  const isOffline = useSelector(state => state.app.isOffline)
  const validateFirstName = (value = firstName) => {
    setFirstNameError(null)
    if (!value.trim()) {
      setFirstNameError("Required field.")
    }
  }
  const validateLastName = (value = lastName) => {
    setLastNameError(null)
    if (!value.trim()) {
      setLastNameError("Required field.")
    }
  }
  const validateUsername = (value = username) => {
    setUsernameError(null)
    if (!value.trim()) {
      setUsernameError("Required field.")
      return
    }
    const re = /^\w+$/;
    const isValid = re.test(value)
    if (!isValid) setUsernameError("Only letters, numbers and underscore are allowed.")
  }
  const validateEmail = (value = email) => {
    setEmailError(null)
    if (!value.trim()) {
      setEmailError("Required field.")
      return
    }
    const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    const isValid = re.test(value)
    if (!isValid) setEmailError("Email is not valid.")
  }
  const validatePassword = (value = password) => {
    setPasswordError(null)
    if (!value.trim()) {
      setPasswordError("Required field.")
      return
    }
    if (value.length < 8) {
      setPasswordError("Password must contain at least 8 characters.")
      return
    }
    const re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*`~\-<>,./+_=()[\]\\]).{8,}$/;
    const isValid = re.test(value)
    if (!isValid) setPasswordError("Password must contain lowercase, uppercase, numerical and symbolic characters.")
  }
  const getIsSubmissionPossible = (
    firstName,
    lastName,
    username,
    email,
    password,
    firstNameError,
    lastNameError,
    usernameError,
    emailError,
    passwordError
  ) => {
    return !(
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      firstNameError ||
      lastNameError ||
      usernameError ||
      emailError ||
      passwordError
    )
  }
  const isSubmissionPossible = useMemo(() => getIsSubmissionPossible(
    firstName,
    lastName,
    username,
    email,
    password,
    firstNameError,
    lastNameError,
    usernameError,
    emailError,
    passwordError
  ), [
    firstName,
    lastName,
    username,
    email,
    password,
    firstNameError,
    lastNameError,
    usernameError,
    emailError,
    passwordError
  ])
  const handleNewAccount = async (e) => {
    e.preventDefault()
    setIsBusy(true)
    try {
      await Auth.signUp(username.trim(), password, {
        given_name: firstName.trim(),
        family_name: lastName.trim(),
        email: email.trim(),
        phone_number: phoneNumber,
      });
      setCurrStep(1)
      setIsBusy(false)
    } catch (error) {
      console.error('error signing in', error);
      switch(error.code) {
        case "UsernameExistsException":
          setUsernameError("This username is taken!")
          break
        default:
          break
      }
      setIsBusy(false)
      dispatch(userActions.handleSetData(null))
      dispatch(userActions.handleSetState(AuthState.SignedOut))
    }
  }
  const completeNewAccount = async (e) => {
    e.preventDefault()
    setVerificationCodeError(null)
    setIsBusy(true)
    try {
      await Auth.confirmSignUp(username, verificationCode)
      await Auth.signIn(username, password);
      cacheController.resetCache(true)
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
      case "firstName":
        setFirstName(value)
        validateFirstName(value)
        break
      case "lastName":
        setLastName(value)
        validateLastName(value)
        break
      case "username":
        setUsername(value)
        validateUsername(value)
        break
      case "email":
        setEmail(value)
        validateEmail(value)
        break
      case "password":
        setPassword(value)
        validatePassword(value)
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
    <div className={styles.NewAccountFormContainer}>
      <div className={styles.NewAccountFormHeader}>
        <span>forwardslash</span>
        <span>Create Account</span>
      </div>
      <form
        className={styles.NewAccountStepOneForm}
        onSubmit={handleNewAccount}
      >
        <TextField
          type="text"
          label="First Name"
          name="firstName"
          placeholder="first name…"
          autoComplete="given-name"
          onChange={handleChange}
          error={firstNameError}
          value={firstName}
        />
        <TextField
          type="text"
          label="Last Name"
          name="lastName"
          placeholder="last name…"
          autoComplete="family-name"
          onChange={handleChange}
          error={lastNameError}
          value={lastName}
        />
        <TextField
          type="text"
          label="Username"
          name="username"
          placeholder="username…"
          autoComplete="username"
          onChange={handleChange}
          error={usernameError}
          value={username}
        />
        <TextField
          type="email"
          label="Email"
          name="email"
          placeholder="email…"
          autoComplete="email"
          onChange={handleChange}
          error={emailError}
          value={email}
        />
        <TextField
          type="password"
          label="Password"
          name="password"
          placeholder="password…"
          autoComplete="new-password"
          onChange={handleChange}
          error={passwordError}
          value={password}
        />
        <Button
          type="submit"
          fullWidth
          label={isBusy ? "Signing Up" : "Sign Up"}
          disabled={!isSubmissionPossible || isBusy}
        />
      </form>
    </div>
  ) : (
    <div className={styles.NewAccountFormContainer}>
      <div className={styles.NewAccountFormHeader}>
        <span>forwardslash</span>
        <span>Confirm Account</span>
        <span>Enter code sent to your email.</span>
      </div>
      <form
        className={styles.NewAccountStepTwoForm}
        onSubmit={completeNewAccount}
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

export default NewAccount;