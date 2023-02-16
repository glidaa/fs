import React, { forwardRef, useImperativeHandle } from "react";
import { useModal } from "../../ModalManager";
import styles from "./Dialog.module.scss"

const Dialog = forwardRef(({ content }, ref) => {

  const { hideModal } = useModal();
  const closeDialog = () => new Promise((resolve) => {
    resolve()
  })

  useImperativeHandle(ref, () => ({
    close() {
      return closeDialog()
    }
  }));

  return (
    <div
      className={styles.DialogShell}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeDialog().then(hideModal);
        }
      }}
    >
      <div className={styles.DialogContainer}>
        {content}
      </div>
    </div>
  )
})

Dialog.displayName = "Dialog"

export default Dialog