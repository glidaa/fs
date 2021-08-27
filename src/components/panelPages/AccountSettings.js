import React, { useState, useMemo } from 'react';
import { connect } from "react-redux";
import * as appActions from "../../actions/app";
import styledComponents from "styled-components";
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { ReactComponent as BackArrowIcon } from "../../assets/chevron-back-outline.svg";
import { ReactComponent as LogOutIcon } from "../../assets/log-out-outline.svg"

const AccountSettings = (props) => {
  const {
    user: {
      data: {
        username,
        firstName,
        lastName,
        email,
        gender,
        birthdate,
        plan,
        avatar,
        abbr
      },
    },
    dispatch
  } = props;

  const [newFirstName, setNewFirstName] = useState(firstName)
  const [newLastName, setNewLastName] = useState(lastName)
  const [newEmail, setNewEmail] = useState(email)
  const [newGender, setNewGender] = useState(gender)
  const [newBirthdate, setNewBirthdate] = useState(birthdate)
  const [newAvatar, setNewAvatar] = useState(avatar)

  const checkIsChanaged = (newFirstName, newLastName) => (
    newFirstName !== firstName ||
    newLastName !== lastName
  )

  const isChanged = useMemo(() => checkIsChanaged(newFirstName, newLastName), [newFirstName, newLastName])
  
  const closePanel = () => {
    return dispatch(appActions.handleSetLeftPanel(false))
  }
	const logOut = () => {
    
	}
  const saveChanges = () => {

  }
  return (
    <>
      <PanelPageToolbar>
        <PanelPageToolbarAction onClick={closePanel}>
          <BackArrowIcon
              width={24}
              height={24}
              strokeWidth={32}
              color="#006EFF"
          />
        </PanelPageToolbarAction>
        <PanelPageTitle>Account Settings</PanelPageTitle>
        <PanelPageToolbarAction onClick={logOut}>
          <LogOutIcon
              width={24}
              height={24}
              strokeWidth={32}
              color="#006EFF"
          />
        </PanelPageToolbarAction>
      </PanelPageToolbar>
      <AccountSettingsHeader>
        <LetterAvatar>
            {abbr}
        </LetterAvatar>
        <span>{firstName} {lastName}</span>
        <span>@{username}</span>
      </AccountSettingsHeader>
      <AccountSettingsForm>
        <form onSubmit={(e) => e.preventDefault()}>
          <AccountSetting>
            <label htmlFor="firstName">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="first name…"
              onChange={(e) => setNewFirstName(e.target.value)}
              value={newFirstName}
            ></input>
          </AccountSetting>
          <AccountSetting>
            <label htmlFor="lastName">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="last name…"
              onChange={(e) => setNewLastName(e.target.value)}
              value={newLastName}
            ></input>
          </AccountSetting>
          <AccountSetting>
            <label htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="email…"
              disabled
              onChange={(e) => setNewEmail(e.target.value)}
              value={newEmail}
            ></input>
          </AccountSetting>
          <AccountSetting>
            <label htmlFor="gender">
              Gender
            </label>
            <input
              type="text"
              name="gender"
              placeholder="gender…"
              disabled
              onChange={(e) => setNewGender(e.target.value)}
              value={newGender}
            ></input>
          </AccountSetting>
          <AccountSetting>
            <label htmlFor="birthdate">
              Birthdate
            </label>
            <input
              type="text"
              name="birthdate"
              placeholder="birthdate…"
              disabled
              onChange={(e) => setNewBirthdate(e.target.value)}
              value={newBirthdate}
            ></input>
          </AccountSetting>
          <input type="submit" name="submit" value="Submit"></input>
        </form>
      </AccountSettingsForm>
      <SaveSettingsBtn disabled={isChanged}>
        Save Changes
      </SaveSettingsBtn>
    </>
  );
};

const AccountSettingsForm = styledComponents(SimpleBar)`
  flex: 1;
  overflow: auto;
  height: 0;
  min-height: 0;
  & .simplebar-content > form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    & > h2 > span {
      cursor: pointer;
    }
    & > input[type="submit"] {
      display: none;
    }
  }
`;

const AccountSetting = styledComponents.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: 0 25px;
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
    padding: 10px 10px;
    border: 1px solid #C0C0C0;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 400;
    &::placeholder {
      color: #C0C0C0;
    }
  }
`

const PanelPageToolbar = styledComponents.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 25px;
  padding-top: 25px;
`

const PanelPageTitle = styledComponents.span`
  color: #000000;
  font-size: 18px;
  font-weight: 600;
`

const PanelPageToolbarAction = styledComponents.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  background-color: transparent;
  cursor: pointer;
`

const AccountSettingsHeader = styledComponents.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 25px;
  & > span:nth-child(2) {
    color: #222222;
    font-size: 26px;
    line-height: 0;
  }
  & > span:nth-child(3) {
    color: #222222;
    font-size: 14px;
    line-height: 0;
  }
`

const SaveSettingsBtn = styledComponents.button`
  padding: 15px 0;
  margin: 0 25px 25px 25px;
  background-color: #006EFF;
  color: #FFFFFF;
  border-radius: 8px;
  outline: none;
  border: none;
  cursor: pointer;
`

const LetterAvatar = styledComponents.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 32px;
  color: #006EFF;
  background-color: #CCE2FF;
  line-height: 0;
  font-size: 64px;
  min-width: 128px;
  min-height: 128px;
  width: 128px;
  height: 128px;
`

export default connect((state) => ({
  user: state.user,
  app: state.app
}))(AccountSettings);
