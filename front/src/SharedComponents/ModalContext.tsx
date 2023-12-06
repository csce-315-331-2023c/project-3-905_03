import React, { createContext, useContext, useState } from 'react';

/**
 * Interface for the ModalContext.
 */
export interface ModalContextType {
    /** The error message to display in the error modal. */
    errorMessage: string;
    /** Function to set the error message. */
    setErrorMessage: (message: string) => void;

    /** Whether the error modal is shown. */
    showErrorModal: boolean;
    /** Function to set whether the error modal is shown. */
    setShowErrorModal: (show: boolean) => void;

    /** Whether the role selection modal is shown. */
    showRoleSelectionModal: boolean;
    /** Function to set whether the role selection modal is shown. */
    setShowRoleSelectionModal: (show: boolean) => void;

    /** Whether the accessibility modal is shown. */
    showAccessibilityModal: boolean;
    /** Function to set whether the accessibility modal is shown. */
    setShowAccessibilityModal: (show: boolean) => void;
}

/**
 * ModalContext is a React context for modals.
 * It provides the state and setters for the error message and whether each modal is shown.
 */
export const ModalContext = createContext<ModalContextType | null>(null);

/**
 * ModalProvider is a React component that provides the ModalContext to its children.
 */
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

/**
 * useModal is a custom hook that allows you to access the ModalContext.
 * @throws {Error} If used outside of a ModalProvider.
 * @returns {ModalContextType} The ModalContext.
 */
export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
