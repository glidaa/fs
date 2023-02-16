import React, { memo } from 'react';
import Button from './Button';
import styles from "./Illustration.module.scss"

const Illustration = (props) => {
  const {
    illustration,
    title,
    actionLabel,
    onAction,
    actionDisabled,
    secondary,
    className,
    style
  } = props
  const handleAction = () => {
    if (onAction) {
      onAction()
    }
  }
  return (
    <div
      className={[
        styles.IllustrationContainer,
        ...(secondary && [styles.secondary] || []),
        className || ""
      ].join(" ")}
      style={style}
    >
      {React.createElement(illustration)}
      <div>
        <span>
          {title}
        </span>
        {actionLabel && (
          <Button
            label={actionLabel}
            onClick={handleAction}
            disabled={actionDisabled}
          />
        )}
      </div>
    </div>
  )
}

export default memo(Illustration);