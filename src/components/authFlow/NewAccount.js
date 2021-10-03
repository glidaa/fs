import React, { useMemo } from 'react';
import styledComponents from "styled-components"
import { useState } from "react"
import { connect } from "react-redux"
import { Auth } from "aws-amplify";
import * as userActions from "../../actions/user"
import * as appActions from "../../actions/app"
import { AuthState } from '../../constants';
import DateField from '../fields/DateField';
import GenderField from '../fields/GenderField';

const NewAccount = (props) => {
  const { setShouldRedirect, dispatch } = props
  const [verificationCode, setVerificationCode] = useState("")
  const [currStep, setCurrStep] = useState(0)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [gender, setGender] = useState("male")
  const [firstNameError, setFirstNameError] = useState(null)
  const [lastNameError, setLastNameError] = useState(null)
  const [usernameError, setUsernameError] = useState(null)
  const [emailError, setEmailError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [dateOfBirthError, setDateOfBirthError] = useState(null)
  const [verificationCodeError, setVerificationCodeError] = useState(null)
  const [isBusy, setIsBusy] = useState(false)
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
  const validateDateOfBirth = (value = dateOfBirth) => {
    setDateOfBirthError(null)
    if (!value) {
      setDateOfBirthError("Required field.")
    }
  }
  const getIsSubmissionPossible = (
    firstName,
    lastName,
    username,
    email,
    password,
    dateOfBirth,
    firstNameError,
    lastNameError,
    usernameError,
    emailError,
    passwordError,
    dateOfBirthError
  ) => {
    return !(
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      !dateOfBirth ||
      firstNameError ||
      lastNameError ||
      usernameError ||
      emailError ||
      passwordError ||
      dateOfBirthError
    )
  }
  const isSubmissionPossible = useMemo(() => getIsSubmissionPossible(
    firstName,
    lastName,
    username,
    email,
    password,
    dateOfBirth,
    firstNameError,
    lastNameError,
    usernameError,
    emailError,
    passwordError,
    dateOfBirthError
  ), [
    firstName,
    lastName,
    username,
    email,
    password,
    dateOfBirth,
    firstNameError,
    lastNameError,
    usernameError,
    emailError,
    passwordError,
    dateOfBirthError
  ])
  const handleNewAccount = async (e) => {
    e.preventDefault()
    setIsBusy(true)
    try {
      await Auth.signUp({
        username: username.trim(),
        password: password,
        attributes: {
            given_name: firstName.trim(),
            family_name: lastName.trim(),
            email: email.trim(),
            birthdate: new Date(dateOfBirth).toISOString().substring(0, 10),
            gender: gender,
            phone_number: phoneNumber,
            
        }
      });
      setCurrStep(1)
      setIsBusy(false)
    } catch (error) {
      console.log('error signing in', error);
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
      case "dateOfBirth":
        setDateOfBirth(value)
        validateDateOfBirth(value)
        break
      case "gender":
        setGender(value)
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
    <NewAccountFormContainer>
      <NewAccountFormHeader>
        <span>Create Account</span>
      </NewAccountFormHeader>
      <NewAccountStepOneForm onSubmit={handleNewAccount}>
        <NewAccountFormEntry isError={firstNameError}>
          <label htmlFor="firstName">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            placeholder="first name…"
            autoComplete="given-name"
            onChange={handleChange}
            value={firstName}
          ></input>
          {firstNameError && <span>{firstNameError}</span>}
        </NewAccountFormEntry>
        <NewAccountFormEntry isError={lastNameError}>
          <label htmlFor="lastName">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            placeholder="last name…"
            autoComplete="family-name"
            onChange={handleChange}
            value={lastName}
          ></input>
          {lastNameError && <span>{lastNameError}</span>}
        </NewAccountFormEntry>
        <NewAccountFormEntry isError={usernameError}>
          <label htmlFor="username">
            Username
          </label>
          <input
            type="text"
            name="username"
            placeholder="username…"
            autoComplete="username"
            onChange={handleChange}
            value={username}
          ></input>
          {usernameError && <span>{usernameError}</span>}
        </NewAccountFormEntry>
        <NewAccountFormEntry isError={emailError}>
          <label htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="email…"
            autoComplete="email"
            onChange={handleChange}
            value={email}
          ></input>
          {emailError && <span>{emailError}</span>}
        </NewAccountFormEntry>
        <NewAccountFormEntry isError={passwordError}>
          <label htmlFor="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="password…"
            autoComplete="new-password"
            onChange={handleChange}
            value={password}
          ></input>
          {passwordError && <span>{passwordError}</span>}
        </NewAccountFormEntry>
        <NewAccountFormEntry>
          <label htmlFor="dateOfBirth">
            Date Of Birth
          </label>
          <DateField
            name="dateOfBirth"
            onChange={handleChange}
            placeholder="no date selected"
            isError={dateOfBirthError}
            value={dateOfBirth}
            isClearable
          />
          {dateOfBirthError && <span>{dateOfBirthError}</span>}
        </NewAccountFormEntry>
        <NewAccountFormEntry>
          <label htmlFor="gender">
            Gender
          </label>
          <GenderField
            onChange={handleChange}
            value={gender}
          />
        </NewAccountFormEntry>
        <SubmitBtn
          type="submit"
          value={isBusy ? "Signing Up" : "Sign Up"}
          disabled={!isSubmissionPossible || isBusy}
        />
      </NewAccountStepOneForm>
    </NewAccountFormContainer>
  ) : (
    <NewAccountFormContainer>
      <NewAccountFormHeader>
        <span>Confirm Account</span>
        <span>Enter code sent to your email.</span>
      </NewAccountFormHeader>
      <NewAccountStepTwoForm onSubmit={completeNewAccount}>
        <NewAccountFormEntry isError={verificationCodeError}>
          <label htmlFor="verificationCode">
            Verification Code
          </label>
          <input
            type="text"
            name="verificationCode"
            placeholder="Code…"
            onChange={handleChange}
            value={verificationCode}
          ></input>
          {verificationCodeError && <span>{verificationCodeError}</span>}
        </NewAccountFormEntry>
        <SubmitBtn
          type="submit"
          value={isBusy ? "Processing" : "Submit"}
          disabled={isBusy || !verificationCode.trim()}
        />
      </NewAccountStepTwoForm>
    </NewAccountFormContainer>
  )
}

const NewAccountFormContainer = styledComponents.div`
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

const NewAccountFormHeader = styledComponents.div`
  display: flex;
  flex-direction: column;
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

const NewAccountStepOneForm = styledComponents.form`
  display: grid;
  grid-template-areas:
    'firstName lastName'
    'username username'
    'email email'
    'password password'
    'dateOfBirth dateOfBirth'
    'gender gender'
    'signUp signUp';
  gap: 15px;
  align-items: start;
  & > *:nth-child(1) {
    grid-area: firstName;
  }
  & > *:nth-child(2) {
    grid-area: lastName;
  }
  & > *:nth-child(3) {
    grid-area: username;
  }
  & > *:nth-child(4) {
    grid-area: email;
  }
  & > *:nth-child(5) {
    grid-area: password;
  }
  & > *:nth-child(6) {
    grid-area: dateOfBirth;
  }
  & > *:nth-child(7) {
    grid-area: gender;
  }
  & > *:nth-child(8) {
    grid-area: signUp;
  }
`;

const NewAccountStepTwoForm = styledComponents.form`
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

const SubmitBtn = styledComponents.input`
  width: 100%;
  padding: 15px 0;
  background-color: #006EFF;
  color: #FFFFFF !important;
  border-radius: 8px;
  outline: none;
  border: none;
  transition: background-color 0.3s ease;
  cursor: pointer;
  &:hover {
    background-color: #0058cc;
  }
  &:disabled {
    background-color: #338bff;
    cursor: default;
  }
`

const NewAccountFormEntry = styledComponents.div`
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
    border: 1px solid ${({isError}) => isError ? "#FF0000" : "#C0C0C0"};
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
  & > span {
    color: #FF0000;
    font-size: 12px;
  }
`

export default connect()(NewAccount);