import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  loginWithOAuth: (provider: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loginWithOAuth = async (provider: string) => {
    setIsAuthenticated(true);
    return Promise.resolve();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loginWithOAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
