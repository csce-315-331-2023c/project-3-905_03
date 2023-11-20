import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: 'Manager' | 'Cashier'; // Add role here
  isAuthenticated: boolean;
}

interface AuthContextProps {
  user: User | null;  
  setUser: (user: User | null) => void; 
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const[user, setUser] = useState<User | null>(null);



  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
