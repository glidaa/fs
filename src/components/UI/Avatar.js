import React from 'react';
import styles from "./Avatar.module.scss";

const Avatar = (props) => {
  const { 
    size,
    user: {
      avatar,
      abbr,
      name
    },
    circular
   } = props
  return avatar ? (
    <img
      className={styles.ImageAvatar}
      style={{
        borderRadius: circular ? "100%" : 0.315 * size,
        width: size,
        height: size
      }}
      src={avatar}
    />
  ) : (
    <div
      className={styles.LetterAvatar}
      style={{
        borderRadius: circular ? "100%" : 0.315 * size,
        fontSize: size / 2.4,
        minWidth: size,
        minHeight: size,
        width: size,
        height: size
      }}
    >
      {abbr || name[0]}
    </div>
  )
}

export default Avatar