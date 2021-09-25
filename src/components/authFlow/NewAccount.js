import React, { useMemo } from 'react';
import styledComponents from "styled-components"
import { useState } from "react"
import { connect } from "react-redux"
import { Auth } from "aws-amplify";
import * as userActions from "../../actions/user"
import * as appActions from "../../actions/app"
import { AuthState } from '@aws-amplify/ui-components';
import DateField from '../DateField';
import GenderField from '../GenderField';

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
    const re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
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
    } catch (error) {
      console.log('error signing in', error);
      switch(error.code) {
        case "UsernameExistsException":
          setUsernameError("This username is taken!")
          break
        default:
          break
      }
      dispatch(userActions.handleSetData(null))
      dispatch(userActions.handleSetState(AuthState.SignedOut))
    }
  }
  const completeNewAccount = async (e) => {
    e.preventDefault()
    try {
      await Auth.confirmSignUp(username, verificationCode)
      dispatch(appActions.setLoading(true))
      setShouldRedirect(true)
    } catch (error) {
      console.log('error signing in', error);
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
      default:
        break
    }
  }
  return currStep === 0 ? (
    <NewAccountFormContainer>
      <NewAccountFormHeader>
        <span>Create Account</span>
      </NewAccountFormHeader>
      <NewAccountForm onSubmit={handleNewAccount}>
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
        <input type="submit" value="Sign Up" disabled={!isSubmissionPossible} />
      </NewAccountForm>
    </NewAccountFormContainer>
  ) : (
    <NewAccountFormContainer>
      <NewAccountFormHeader>
        <span>Create Account</span>
      </NewAccountFormHeader>
      <NewAccountForm onSubmit={completeNewAccount}>
        <NewAccountFormEntry>
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
        </NewAccountFormEntry>
        <input type="submit" value="Submit" />
      </NewAccountForm>
    </NewAccountFormContainer>
  )
}

const NewAccountFormContainer = styledComponents.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: center;
  background-color: #FFFFFF;
  border-radius: 25px;
  height: fit-content;
  max-height: calc(100% - 70px);
  width: 350px;
  padding: 35px;
  @media only screen and (max-width: 768px) {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
`

const NewAccountFormHeader = styledComponents.div`
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

const NewAccountForm = styledComponents.form`
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
    transition: background-color 0.3s ease;
    &:hover {
      background-color: #0058cc;
    }
    &:disabled {
      background-color: #338bff;
    }
  }
`;

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

const NewAccountWithGoogleBtn = styledComponents.button`
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

const NewAccountWithEmailHeader = styledComponents.span`
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

export default connect()(NewAccount);