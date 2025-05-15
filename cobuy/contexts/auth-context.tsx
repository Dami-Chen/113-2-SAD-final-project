// contexts/auth-context.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
  isLoggedIn: boolean;
  isAuthReady: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const login = async (username: string, password: string) => {
    try {
      await axios.post('http://10.120.199.92:3001/api/login', { username, password });
      setIsLoggedIn(true);
    } catch (err: any) {
      alert(err.response?.data?.error || '登入失敗');
    } finally {
      setIsAuthReady(true);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAuthReady(true);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAuthReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside an AuthProvider');
  return context;
};
