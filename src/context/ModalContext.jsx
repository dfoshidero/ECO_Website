import React, { createContext, useContext, useState } from "react";
import "./ModalContext.scss";

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [genericModalContent, setGenericModalContent] = useState(null);

  const openGenericModal = (content) => setGenericModalContent(content);
  const closeGenericModal = () => setGenericModalContent(null);

  return (
    <ModalContext.Provider
      value={{
        openGenericModal,
        closeGenericModal,
      }}
    >
      {children}
      {genericModalContent && (
        <div
          className="modal-overlay"
          onClick={closeGenericModal}
          role="presentation"
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {genericModalContent}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};
