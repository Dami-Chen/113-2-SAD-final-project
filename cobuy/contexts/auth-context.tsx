import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import OneSignal from 'react-native-onesignal';

interface AuthContextType {
  isLoggedIn: boolean;
  isAuthReady: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 開發階段寫死 true，實作時請修正
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    try {
      await axios.post('http://10.118.197.142:3001/api/login', { username, password });

      setIsLoggedIn(true);
      setUsername(username);

      // 儲存 username 給 OneSignal 使用（App 初始化時可以抓到）
      localStorage.setItem('username', username);

      // 綁定 OneSignal 使用者 ID
      OneSignal.login(username);
    } catch (err: any) {
      alert(err.response?.data?.error || '登入失敗');
    } finally {
      setIsAuthReady(true);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername(null);
    localStorage.removeItem('username');
    OneSignal.logout(); // 清除 OneSignal 綁定
    setIsAuthReady(true);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAuthReady, login, logout, username }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside an AuthProvider');
  return context;
};
