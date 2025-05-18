import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import OneSignal from 'react-native-onesignal';

interface AuthContextType {
  isLoggedIn: boolean;
  isAuthReady: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (form: RegisterFormType) => Promise<void>;
}

export interface RegisterFormType {
  username: string;
  password: string;
  nickname: string;
  real_name: string;
  email: string;
  school: string;
  student_id: string;
  dorm: string;
  phone: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 開發階段寫死 true，實作時請修正
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    try {
      await axios.post('http://192.168.1.124:3001/api/login', { username, password }); // 填自己的位址，形式像是：http://192.168.X.X:3001/api
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

  const register = async (form: RegisterFormType) => {
    try {
      await axios.post('http://<your IP>:3001/api/register', {
        ...form,
        score: 0, // 預設值
      });
      alert('註冊成功，請登入');
    } catch (err: any) {
      console.error('註冊失敗:', err);
  
      const errorMessage =
        err.response?.data?.error || '註冊失敗';
      const detailMessage = err.response?.data?.detail;
  
      alert(`❌ ${errorMessage}${detailMessage ? `\n原因：${detailMessage}` : ''}`);
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
    <AuthContext.Provider value={{ isLoggedIn, isAuthReady, login, logout, username, register}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside an AuthProvider');
  return context;
};
