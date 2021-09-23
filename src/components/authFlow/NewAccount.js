import React from 'react';
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
  const handleNewAccount = async (e) => {
    e.preventDefault()
    try {
      const { user } = await Auth.signUp({
        username: username,
        password: password,
        attributes: {
            given_name: firstName,
            family_name: lastName,
            email: email,
            birthdate: new Date(dateOfBirth).toISOString().substring(0, 10),
            gender: gender,
            phone_number: phoneNumber,
            
        }
      });
      setCurrStep(1)
      dispatch(appActions.setLoading(true))
      setShouldRedirect(true)
    } catch (error) {
      console.log('error signing in', error);
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
  return currStep === 0 ? (
    <NewAccountFormContainer>
      <NewAccountFormHeader>
        <span>Create Account</span>
      </NewAccountFormHeader>
      <NewAccountForm onSubmit={handleNewAccount}>
        <NewAccountFormEntry>
          <label htmlFor="firstName">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            placeholder="first name…"
            autoComplete="given-name"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
          ></input>
        </NewAccountFormEntry>
        <NewAccountFormEntry>
          <label htmlFor="lastName">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            placeholder="last name…"
            autoComplete="family-name"
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
          ></input>
        </NewAccountFormEntry>
        <NewAccountFormEntry>
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
        </NewAccountFormEntry>
        <NewAccountFormEntry>
          <label htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="email…"
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          ></input>
        </NewAccountFormEntry>
        <NewAccountFormEntry>
          <label htmlFor="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="password…"
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          ></input>
        </NewAccountFormEntry>
        <NewAccountFormEntry>
          <label htmlFor="dateOfBirth">
            Date Of Birth
          </label>
          <DateField
            name="dateOfBirth"
            onChange={(e) => setDateOfBirth(e.target.value)}
            placeholder="no date selected"
            value={dateOfBirth}
          />
        </NewAccountFormEntry>
        <NewAccountFormEntry>
          <label htmlFor="gender">
            Gender
          </label>
          <GenderField
            onChange={(e) => setGender(e.target.value)}
            value={gender}
          />
        </NewAccountFormEntry>
        <input type="submit" value="Sign Up" />
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
            onChange={(e) => setVerificationCode(e.target.value)}
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
  max-height: calc(100% - 90px);
  width: 350px;
  padding: 45px;
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
    font-size: 28px;
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
    cursor: pointer;
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
    font-size: 16px;
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