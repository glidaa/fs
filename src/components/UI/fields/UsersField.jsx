import React, { memo } from 'react';
import styles from "./UsersField.module.scss";
import { ReactComponent as RemoveIcon } from "@fluentui/svg-icons/icons/delete_16_regular.svg";
import { ReactComponent as AddIcon } from "@fluentui/svg-icons/icons/add_16_regular.svg";
import { ReactComponent as MailIcon } from "@fluentui/svg-icons/icons/mail_16_regular.svg";
import ShadowScroll from '../../ShadowScroll';
import Button from '../Button';
import Chip from '../Chip';

const UsersField = (props) => {
  const {
    name,
    label,
    emptyMsg,
    onAdd,
    onRemove,
    value,
    readOnly,
  } = props

  const handleRemove = (user) => {
    if (!readOnly) {
      onRemove({
        target: {
          name: name,
          value: user.username || user.name || user.email,
          type: user.username
            ? "registered"
            : user.name
            ? "anonymous"
            : "invited",
        },
      })
    }
  }

  return (
    <div className={styles.UsersFieldShell}>
      <div className={styles.UsersFieldHeader}>
        {label && (
          <label htmlFor={name}>
            {label}
          </label>
        )}
        {!readOnly && (
          <Button
            sm
            secondary
            icon={AddIcon}
            onClick={onAdd}
          />
        )}
      </div>
      {(value.length) ? (
        <ShadowScroll>
          {value.map(user => (
            <Chip
              key={user.username || user.name || user.email}
              avatarImage={user.avatar}
              avatarAlt={
                user.username
                ? `${user.firstName} ${user.lastName}`
                : user.initials
                ? user.name
                : user.email
              }
              avatarInitials={user.initials}
              primaryLabel={
                user.username
                ? `${user.firstName} ${user.lastName[0]}.`
                : user.initials
                ? user.name
                : user.email
              }
              secondaryLabel={
                user.username
                ? `@${user.username}`
                : user.initials
                ? "Anonymous"
                : "Invited by email"
              }
              avatarIcon={!(user.username || user.initials) && MailIcon}
              actionIcon={RemoveIcon}
              onAction={() => handleRemove(user)}
              actionAllowed={!readOnly}
            />
          ))}
        </ShadowScroll>
      ) : (
        <div className={styles.NoUsers}>
          {emptyMsg}
        </div>
      )}
    </div>
  )
}

export default memo(UsersField);