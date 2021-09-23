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
  const [currStep, setCurrStep] = useState(0)
  const initiatePasswordRecovery = async (e) => {
    e.preventDefault()
    try {
      await Auth.forgotPassword(username)
      setCurrStep(1)
    } catch (error) {
      console.log('error signing in', error);
    }
  }
  const completePasswordRecovery = async (e) => {
    e.preventDefault()
    try {
      await Auth.forgotPasswordSubmit(username, verificationCode, newPassword)
      dispatch(appActions.setLoading(true))
      setShouldRedirect(true)
    } catch (error) {
      console.log('error signing in', error);
    }
  }
  return currStep === 0 ? (
    <ForgotPasswordFormContainer>
      <ForgotPasswordFormHeader>
        <span>Forgot Password?</span>
      </ForgotPasswordFormHeader>
      <ForgotPasswordForm onSubmit={initiatePasswordRecovery}>
        <ForgotPasswordFormEntry>
        <label htmlFor="username">
          Username*
        </label>
        <input
          type="test"
          name="username"
          placeholder="username…"
          autoComplete="username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        ></input>
        </ForgotPasswordFormEntry>
        <input type="submit" value="Next" />
      </ForgotPasswordForm>
    </ForgotPasswordFormContainer>
  ) : (
    <ForgotPasswordFormContainer>
      <ForgotPasswordFormHeader>
        <span>Forgot Password?</span>
      </ForgotPasswordFormHeader>
      <ForgotPasswordForm onSubmit={completePasswordRecovery}>
        <ForgotPasswordFormEntry>
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
        </ForgotPasswordFormEntry>
        <ForgotPasswordFormEntry>
          <label htmlFor="newPassword">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            placeholder="Password…"
            autoComplete="new-password"
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
          ></input>
        </ForgotPasswordFormEntry>
        <input type="submit" value="Submit" />
      </ForgotPasswordForm>
    </ForgotPasswordFormContainer>
  )
}

const ForgotPasswordFormContainer = styledComponents.div`
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

const ForgotPasswordFormHeader = styledComponents.div`
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

const ForgotPasswordForm = styledComponents.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
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
    transition: background-color 0.3s linear;
    &:hover {
      background-color: #0058cc;
    }
    &:disabled {
      background-color: #338bff;
    }
  }
`;

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

export default connect()(ForgotPassword);