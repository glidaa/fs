import React, { Fragment, memo } from "react"
import styles from "./AvatarGroup.module.scss"

const AvatarGroup = (props) => {
  const {
    max = Infinity,
    users,
    size
  } = props

  return (
    <div
      className={styles.AvatarGroupContainer}
      style={{
        minHeight: size,
        minWidth: (users.length ? size : 0) + (users.length > 1 ? ((users.length > max ? max : users.length) * (size - size * 0.58)) : 0)
      }}
    >
      {users.slice(0, users.length > max ? max - 1 : max).map(({ avatar, initials, name, color }, i) => (
        <Fragment key={i}>
          {avatar ?
            <img
              className={styles.ImageAvatar}
              style={{
                borderColor: color,
                width: size,
                height: size,
                ...(i < max - 1 && {
                  marginRight: -(size * 0.42)
                })
              }}
              alt={name}
              src={avatar}
            /> :
            <div 
              className={styles.LetterAvatar}
              style={{
                borderColor: color,
                fontSize: size / 2.4,
                minWidth: size,
                minHeight: size,
                width: size,
                height: size,
                ...(i < max - 1 && {
                  marginRight: -(size * 0.42)
                })
              }}
            >
              {initials || name[0]}
            </div>
          }
        </Fragment>
      ))}
      {users.length > max && (
        <div 
          className={styles.LetterAvatar}
          style={{
            borderColor: "#0067C0",
            fontSize: size / 2.4,
            minWidth: size,
            minHeight: size,
            width: size,
            height: size
          }}
        >
          +{users.length - max + 1}
        </div>
      )}
    </div>
  )
}

export default memo(AvatarGroup)