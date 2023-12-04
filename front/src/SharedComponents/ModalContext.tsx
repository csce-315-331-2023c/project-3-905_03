import React, { createContext, useContext, useState } from 'react';

export interface ModalContextType {

    errorMessage: string;
    setErrorMessage: (message: string) => void;

    showErrorModal: boolean;
    setShowErrorModal: (show: boolean) => void;

    showRoleSelectionModal: boolean;
    setShowRoleSelectionModal: (show: boolean) => void;

    showAccessibilityModal: boolean;
    setShowAccessibilityModal: (show: boolean) => void;
}

export const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showRoleSelectionModal, setShowRoleSelectionModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);

    return (
        <ModalContext.Provider value={{ showErrorModal, setShowErrorModal, showRoleSelectionModal, setShowRoleSelectionModal, errorMessage, setErrorMessage, showAccessibilityModal, setShowAccessibilityModal }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
