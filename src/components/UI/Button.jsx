import React, { memo } from "react";
import styles from "./Button.module.scss";

const Button = (props) => {
  const {
    label,
    icon,
    sm,
    secondary,
    fullWidth,
    children,
    className,
    ...nativeProps
  } = props;
  return props.type === "submit" ? (
    <input
      value={label}
      className={[
        styles.Button,
        ...(secondary && [styles.secondary] || []),
        ...(fullWidth && [styles.fullWidth] || []),
        ...(sm && [styles.sm] || []),
        className
      ].join(" ")}
      {...nativeProps}
    />
  ) : (
    <button
      className={[
        styles.Button,
        ...(secondary && [styles.secondary] || []),
        ...(fullWidth && [styles.fullWidth] || []),
        ...(sm && [styles.sm] || []),
        className
      ].join(" ")}
      {...nativeProps}
    >
      {icon && React.createElement(icon, {
        className: styles.ButtonIcon,
        fill: "currentColor",
      })}
      {label && (<span>{label}</span>)}
    </button>
  );
};

export default memo(Button);
