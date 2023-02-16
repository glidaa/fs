import React from "react";
import { useWindowSize } from "../../../components/WindowSizeListener";
import Sheet from "./Sheet";
import Dialog from "./Dialog";
import styles from "./index.module.scss"
import Button from "../Button";

const Modal = (props) => {
  const {
    primaryButtonText,
    secondaryButtonText,
    primaryButtonDisabled,
    secondaryButtonDisabled,
    title,
    children,
    onPrimaryButtonClick,
    onSecondaryButtonClick,
    modalRef
  } = props
  const { width } = useWindowSize();
  const ModalContent = (
    <>
      <div className={styles.ModalHeaderBody}>
        <div className={styles.ModalHeader}>
          <span>{title}</span>
        </div>
        <div className={`${styles.ModalBody} sleek-scrollbar`}>
          {children}
        </div>
      </div>
      <div className={styles.ModalFooter}>
        <Button
          label={primaryButtonText}
          fullWidth
          disabled={primaryButtonDisabled}
          onClick={onPrimaryButtonClick}
        />
        {secondaryButtonText && (
          <Button
            label={secondaryButtonText}
            fullWidth
            secondary
            disabled={secondaryButtonDisabled}
            onClick={onSecondaryButtonClick}
          />
        )}
      </div>
    </>
  )
  return width > 768 ? (
    <Dialog ref={modalRef} content={ModalContent} />
  ) : (
    <Sheet ref={modalRef} content={ModalContent} />
  );
}

export default Modal