import React from "react"
import styles from "./ProgressBar.module.scss"

const ProgressBar = (props) => {
  const { max, value, style } = props;
  return (
    <div
      className={styles.ProgressBarContainer}
      progress={value / max * 100}
      style={style}
    >
      <div style={{width: `${(value / max * 100) || 0}%`}} />
    </div>
  );
}

export default ProgressBar