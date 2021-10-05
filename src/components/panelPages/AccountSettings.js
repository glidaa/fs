import React, { useState, useMemo } from 'react';
import { connect } from "react-redux";
import { API, graphqlOperation } from "aws-amplify";
import * as mutations from "../../graphql/mutations"
import * as appActions from "../../actions/app";
import styledComponents from "styled-components";
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { ReactComponent as BackArrowIcon } from "../../assets/chevron-back-outline.svg";
import { ReactComponent as LogOutIcon } from "../../assets/log-out-outline.svg"
import DateField from '../UI/fields/DateField';
import Button from '../UI/Button';
import Select from '../UI/fields/Select';
import TextField from '../UI/fields/TextField';
import Avatar from '../UI/Avatar';

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

  const checkIsChanaged = (
    newFirstName,
    newLastName,
    newBirthdate,
    newGender,
    firstName,
    lastName,
    birthdate,
    gender
  ) => (
    !(newFirstName === firstName &&
    newLastName === lastName &&
    newBirthdate === birthdate &&
    newGender === gender)
  )

  const isChanged = useMemo(() => checkIsChanaged(
    newFirstName,
    newLastName,
    newBirthdate,
    newGender,
    firstName,
    lastName,
    birthdate,
    gender
  ), [
    newFirstName,
    newLastName,
    newBirthdate,
    newGender,
    firstName,
    lastName,
    birthdate,
    gender
  ])
  
  const closePanel = () => {
    return dispatch(appActions.handleSetLeftPanel(false))
  }
	const logOut = () => {
    
	}
  const saveChanges = () => {
    API.graphql(graphqlOperation(mutations.updateUser, {
      input: {
        username,
        ...(newFirstName !== firstName && { firstName: newFirstName }),
        ...(newLastName !== lastName && { lastName: newLastName })
      }
    }))
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
        <Avatar user={props.user.data} size={128} />
        <span>{firstName} {lastName}</span>
        <span>@{username}</span>
      </AccountSettingsHeader>
      <AccountSettingsForm>
        <form onSubmit={(e) => e.preventDefault()}>
          <TextField
            type="text"
            name="firstName"
            label="First Name"
            placeholder="first name…"
            onChange={(e) => setNewFirstName(e.target.value)}
            value={newFirstName}
          />
          <TextField
            type="text"
            name="lastName"
            label="Last Name"
            placeholder="last name…"
            onChange={(e) => setNewLastName(e.target.value)}
            value={newLastName}
          />
          <TextField
            type="email"
            name="email"
            label="Email"
            placeholder="email…"
            disabled
            onChange={(e) => setNewEmail(e.target.value)}
            value={newEmail}
          />
          <DateField
            name="dateOfBirth"
            label="Date Of Birth"
            onChange={(e) => setNewBirthdate(e.target.value)}
            placeholder="no date selected"
            value={newBirthdate}
          />
          <Select
            name="gender"
            label="Gender"
            values={["male", "female"]}
            options={["Male", "Female"]}
            colors={["#FFEBE5", "#FDF1DB"]}
            onChange={(e) => setNewGender(e.target.value)}
            value={newGender}
          />
          <input type="submit" name="submit" value="Submit"></input>
        </form>
      </AccountSettingsForm>
      <Button
        style={{ margin: "0 25px 25px 25px" }}
        onClick={saveChanges}
        disabled={!isChanged}
      >
        Save Changes
      </Button>
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
    margin: 0 25px 25px 25px;
    & > h2 > span {
      cursor: pointer;
    }
    & > input[type="submit"] {
      display: none;
    }
  }
`;

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

export default connect((state) => ({
  user: state.user,
  app: state.app
}))(AccountSettings);
