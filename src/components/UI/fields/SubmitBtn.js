import React from "react"
import styles from "./SubmitBtn.module.scss";

const SubmitBtn = (props) => (
  <input className={styles.Button} {...props} />
)

export default SubmitBtn