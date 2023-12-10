import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Interface for User.
 */
export interface User {
  employeeID: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profilePic: string;
  createdAt: string;
  
  phone: string;
  payRate: string;
  
  altEmail: string;
  preferredName: string;
  address: string;
  
  emergencyContactFirstName: string;
  emergencyContactLastName: string;
  emergencyContactPhone: string;

}

/**
 * Interface for AuthContextProps.
 */
interface AuthContextProps {
  /** Current user. */
  user: User | null;
  /** Function to set the current user. */
  setUser: (user: User | null) => void;
}

/**
 * AuthContext is a React context for authentication.
 * It provides the current user and a function to set the current user.
 */
const AuthContext = createContext<AuthContextProps | null>(null);

/**
 * useAuth is a custom hook that allows you to access the AuthContext.
 * @throws {Error} If used outside of an AuthProvider.
 * @returns {AuthContextProps} The AuthContext.
 */
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * AuthProvider is a React component that provides the AuthContext to its children.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};