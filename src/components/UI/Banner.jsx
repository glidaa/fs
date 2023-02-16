import React, { memo } from 'react';
import styles from "./Banner.module.scss"

const Banner = (props) => {
  const {
    content,
    variant = "attention",
    onClick
  } = props;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  }
  return (
    <div
      className={[
        "noselect",
        styles.BannerContainer,
        ...(onClick ? [styles.clickable] : []),
        ...(variant === "attention" ? [styles.attention] : []),
        ...(variant === "success" ? [styles.success] : []),
        ...(variant === "caution" ? [styles.caution] : []),
        ...(variant === "critical" ? [styles.critical] : [])
      ].join(" ")}
      onClick={handleClick}
    >
      <span>{content}</span>
    </div>
  )
}

export default memo(Banner);