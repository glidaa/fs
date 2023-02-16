import React from "react";
import { useModal } from "../ModalManager";
import Modal from "../UI/Modal/";

const Confirmation = ({ title, question, acceptLabel, onAccept }) => {

  const { modalRef, hideModal } = useModal();

  return (
    <Modal
      title={title}
      primaryButtonText={acceptLabel}
      secondaryButtonText="Cancel"
      onPrimaryButtonClick={onAccept}
      onSecondaryButtonClick={hideModal}
      modalRef={modalRef}
    >
      {question}
    </Modal>
  );
};

export default Confirmation;