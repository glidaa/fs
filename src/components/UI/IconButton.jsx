import React, { memo } from "react";
import styles from "./IconButton.module.scss";

const IconButton = (props) => {
  const {
    icon,
    children,
    ...nativeProps
  } = props;
  return (
    <button className={styles.IconButton} {...nativeProps}>
      {icon ? React.createElement(icon, {
        className: styles.ButtonIcon,
        fill: "currentColor",
      }) : null}
    </button>
  );
};

export default memo(IconButton);
