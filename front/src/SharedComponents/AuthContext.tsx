import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

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
  exp: number;
}

/**
 * Interface for AuthContextProps.
 */
interface AuthContextProps {
  user: User | null; // Current user.
  setUser: (user: User | null) => void; // Function to set the current user.
}

/**
 * AuthContext provides the current user and a function to set the current user.
 */
const AuthContext = createContext<AuthContextProps | null>(null);

/**
 * useAuth is a custom hook to access the AuthContext.
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
 * AuthProvider provides the AuthContext to its children.
 * @param children - The child components.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser: User = jwtDecode<User>(token);
        if (decodedUser.exp * 1000 > Date.now()) {
          setUser(decodedUser);
        } else {
          console.log('Token expired or invalid');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');

        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');

      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
