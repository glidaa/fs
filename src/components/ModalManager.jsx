import React, { useState, createContext, useContext, useRef } from "react";

const initalState = {
  modalRef: null,
  isModalOpened: false,
  showModal: () => {},
  hideModal: () => {},
};

const ModalContext = createContext(initalState);
export const useModal = () => useContext(ModalContext);

const ModalManager = ({ children }) => {
  const [modal, setModal] = useState(null);
  const [isModalOpened, setIsModalOpened] = useState(false);

  const modalRef = useRef(null);

  const showModal = (nextModal, props = {}) => {
    setIsModalOpened(true);
    setModal(React.createElement(nextModal, props));
  };

  const hideModal = () => {
    modalRef.current?.close().then(() => {
      setModal(null);
      setIsModalOpened(false);
    });
  };

  return (
    <ModalContext.Provider value={{ isModalOpened, modalRef, showModal, hideModal }}>
      {modal}
      {children}
    </ModalContext.Provider>
  );
};

export default ModalManager;