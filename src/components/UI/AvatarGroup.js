import React, { Fragment } from "react"
import styles from "./AvatarGroup.module.scss"

const AvatarGroup = (props) => {
	const {
		max,
		users,
		size
	} = props

	return (
		<div
      className={styles.AvatarGroupContainer}
			style={{
        minHeight: size,
        minWidth: size + (max * (size - size * 0.42)) - (size * 0.2)
      }}
		>
			{users.slice(0, users.length > max ? max - 1 : max).map(({ avatar, abbr, name, color }, i) => (
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
              src={avatar}
            /> :
						<div 
              className={styles.LetterAvatar}
              style={{
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
              {abbr || name[0]}
            </div>
					}
				</Fragment>
			))}
			{users.length <= max && new Array(max - users.length).fill(0).map((_, i) => (
        <div 
          className={styles.DumpAvatar}
          style={{
            minWidth: size,
            minHeight: size,
            width: size,
            height: size,
            ...(i < max - 1 && {
              marginRight: -(size * 0.42)
            })
          }}
          key={i}
        />
			))}
			{users.length > max && (
        <div 
          className={styles.LetterAvatar}
          style={{
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

export default AvatarGroup