import React, { useState, useMemo, useImperativeHandle, forwardRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import * as mutations from "../../graphql/mutations"
import * as appActions from "../../actions/app";
import * as userActions from "../../actions/user";
import styles from "./AccountSettings.module.scss"
import { ReactComponent as LogOutIcon } from "@fluentui/svg-icons/icons/sign_out_24_regular.svg";
import TextField from '../UI/fields/TextField';
import Avatar from '../UI/Avatar';
import API from '../../amplify/API';
import { useModal } from '../ModalManager';
import modals from '../modals';

const AccountSettings = forwardRef((_, ref) => {

  const { showModal } = useModal();

  const dispatch = useDispatch();

  const userData = useSelector(state => state.user.data);

  const isSynced = useSelector(state => state.app.isSynced);

  const {
    username,
    firstName,
    lastName,
    email,
    plan,
    avatar,
    initials
  } = userData;

  const [isBusy, setIsBusy] = useState(false)
  const [newFirstName, setNewFirstName] = useState(firstName)
  const [newLastName, setNewLastName] = useState(lastName)
  const [newEmail, setNewEmail] = useState(email)
  const [newAvatar, setNewAvatar] = useState(avatar)

  const checkIsChanaged = (
    newFirstName,
    newLastName,
    firstName,
    lastName,
  ) => (
    !(newFirstName === firstName &&
    newLastName === lastName)
  )

  const isChanged = useMemo(() => checkIsChanaged(
    newFirstName,
    newLastName,
    firstName,
    lastName
  ), [
    newFirstName,
    newLastName,
    firstName,
    lastName
  ])
  
  const closePanel = () => {
    return dispatch(appActions.handleSetLeftPanel(false))
  }
  const logOut = () => {
    showModal(modals.CONFIRMATION, {
      title: "Log out",
      question: "Are you sure you want to log out?",
      acceptLabel: "Log out",
      onAccept: () => {
        dispatch(userActions.handleSignOut(true));
      }
    })
  }
  const saveChanges = () => {
    setIsBusy(true)
    API.execute(mutations.updateUser, {
      input: {
        username,
        firstName: newFirstName,
        lastName: newLastName
      }
    }).then((_) => {
      setIsBusy(false)
    }).catch(() => {
      setIsBusy(false)
    })
  }
  useImperativeHandle(ref, () => ({
    panelProps: {
      title: "Account Settings",
      actionIcon: LogOutIcon,
      submitLabel: isBusy
        ? "Saving Changes"
        : isSynced
        ? "Save Changes"
        : "No Connection!",
      submitDisabled: isBusy || !isChanged || !isSynced,
      header: (
        <div className={styles.AccountSettingsHeader}>
          <Avatar
            image={userData.avatar}
            initials={userData.initials}
            alt={`${userData.firstName} ${userData.lastName}`}
            size={128}
          />
          <span>
            {firstName} {lastName}
          </span>
          <span>@{username}</span>
        </div>
      ),
      onClose: () => {
        closePanel();
      },
      onAction: () => {
        logOut();
      },
      onSubmit: () => {
        saveChanges();
      },
    },
  }));
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={styles.AccountSettingsForm}
    >
      <TextField
        type="text"
        name="firstName"
        label="First Name"
        placeholder="first name…"
        onChange={(e) => setNewFirstName(e.target.value)}
        value={newFirstName}
        readOnly={!isSynced}
      />
      <TextField
        type="text"
        name="lastName"
        label="Last Name"
        placeholder="last name…"
        onChange={(e) => setNewLastName(e.target.value)}
        value={newLastName}
        readOnly={!isSynced}
      />
      <TextField
        type="email"
        name="email"
        label="Email"
        placeholder="email…"
        disabled
        onChange={(e) => setNewEmail(e.target.value)}
        value={newEmail}
        readOnly={!isSynced}
      />
    </form>
  );
});

AccountSettings.displayName = "AccountSettings";

export default AccountSettings;