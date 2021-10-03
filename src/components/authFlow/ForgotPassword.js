import React from 'react';
import styledComponents from "styled-components"
import { useState } from "react"
import { connect } from "react-redux"
import { Auth } from "aws-amplify";
import * as appActions from "../../actions/app"

const ForgotPassword = (props) => {
  const { setShouldRedirect, dispatch } = props
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
      dispatch(appActions.setLoading(true))
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
    <ForgotPasswordFormContainer>
      <ForgotPasswordFormHeader>
        <span>Forgot Password?</span>
      </ForgotPasswordFormHeader>
      <ForgotPasswordForm onSubmit={initiatePasswordRecovery}>
        <ForgotPasswordFormEntry isError={usernameError}>
          <label htmlFor="username">
            Username
          </label>
          <input
            type="test"
            name="username"
            placeholder="username…"
            autoComplete="username"
            onChange={handleChange}
            value={username}
          ></input>
          {usernameError && <span>{usernameError}</span>}
        </ForgotPasswordFormEntry>
        <SubmitBtn
          type="submit"
          value={isBusy ? "Processing" : "Next"}
          disabled={isBusy || !username.trim()}
        />
      </ForgotPasswordForm>
    </ForgotPasswordFormContainer>
  ) : currStep === 1 ? (
    <ForgotPasswordFormContainer>
      <ForgotPasswordFormHeader>
        <span>Confirm Account First</span>
        <span>Enter code sent to your email.</span>
      </ForgotPasswordFormHeader>
      <ForgotPasswordForm onSubmit={confirmAccount}>
        <ForgotPasswordFormEntry isError={verificationCodeError}>
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
        </ForgotPasswordFormEntry>
        <SubmitBtn
          type="submit"
          value={isBusy ? "Processing" : "Next"}
          disabled={isBusy || !verificationCode.trim()}
        />
      </ForgotPasswordForm>
    </ForgotPasswordFormContainer>
  ) : (
    <ForgotPasswordFormContainer>
      <ForgotPasswordFormHeader>
        <span>Forgot Password?</span>
      </ForgotPasswordFormHeader>
      <ForgotPasswordForm onSubmit={completePasswordRecovery}>
        <ForgotPasswordFormEntry isError={verificationCodeError}>
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
        </ForgotPasswordFormEntry>
        <ForgotPasswordFormEntry isError={newPasswordError}>
          <label htmlFor="newPassword">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            placeholder="Password…"
            autoComplete="new-password"
            onChange={handleChange}
            value={newPassword}
          ></input>
          {newPasswordError && <span>{newPasswordError}</span>}
        </ForgotPasswordFormEntry>
        <SubmitBtn
          type="submit"
          value={isBusy ? "Processing" : "Submit"}
          disabled={isBusy || !verificationCode.trim() || !newPassword.trim() || newPasswordError}
        />
      </ForgotPasswordForm>
    </ForgotPasswordFormContainer>
  )
}

const ForgotPasswordFormContainer = styledComponents.div`
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

const ForgotPasswordFormHeader = styledComponents.div`
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

const ForgotPasswordForm = styledComponents.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  & > h2 > span {
    cursor: pointer;
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
  transition: background-color 0.3s;
  cursor: pointer;
  &:hover {
    background-color: #0058cc;
  }
  &:disabled {
    background-color: #338bff;
    cursor: default;
  }
`

const ForgotPasswordFormEntry = styledComponents.div`
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

export default connect()(ForgotPassword);