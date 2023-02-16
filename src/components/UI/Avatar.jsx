import React, { memo } from 'react';
import styles from "./Avatar.module.scss";

const Avatar = (props) => {
  const { 
    size,
    image,
    alt,
    initials,
    icon,
    borderless,
    circular
   } = props
  return image ? (
    <img
      className={styles.ImageAvatar}
      style={{
        borderRadius: circular ? "100%" : 0.315 * size,
        width: size,
        height: size
      }}
      alt={alt}
      src={image}
    />
  ) : (
    <div
      className={[
        styles.LetterAvatar,
        ...(borderless ? [styles.borderless] : [])
      ].join(" ")}
      style={{
        borderRadius: circular ? "100%" : 0.315 * size,
        fontSize: (borderless ? size : size - 1) / 2.4,
        minWidth: borderless ? size : size - 1,
        minHeight: borderless ? size : size - 1,
        width: borderless ? size : size - 1,
        height: borderless ? size : size - 1
      }}
    >
      {initials || React.createElement(icon, {
        width: size - 16,
        height: size - 16,
        fill: "currentColor"
      })}
    </div>
  )
}

export default memo(Avatar)