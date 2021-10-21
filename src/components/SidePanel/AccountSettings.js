import React, { useState, useMemo } from 'react';
import { connect } from "react-redux";
import { API, graphqlOperation } from "@aws-amplify/api";
import * as mutations from "../../graphql/mutations"
import * as appActions from "../../actions/app";
import themes from "../../themes"
import styles from "./AccountSettings.module.scss"
import SimpleBar from 'simplebar-react';
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
    appSettings,
    dispatch
  } = props;

  const theme = themes[appSettings.theme];

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
      <div className={styles.PanelPageToolbar}>
        <button
          className={styles.PanelPageToolbarAction}
          onClick={closePanel}
        >
          <BackArrowIcon
              width={24}
              height={24}
              strokeWidth={32}
              color={theme.primary}
          />
        </button>
        <span className={styles.PanelPageTitle}>
          Account Settings
        </span>
        <button
          className={styles.PanelPageToolbarAction}
          onClick={logOut}
          >
          <LogOutIcon
              width={24}
              height={24}
              strokeWidth={32}
              color={theme.primary}
          />
        </button>
      </div>
      <div className={styles.AccountSettingsHeader}>
        <Avatar user={props.user.data} size={128} />
        <span>{firstName} {lastName}</span>
        <span>@{username}</span>
      </div>
      <SimpleBar className={styles.AccountSettingsForm}>
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
      </SimpleBar>
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

export default connect((state) => ({
  user: state.user,
  app: state.app,
  appSettings: state.appSettings
}))(AccountSettings);
