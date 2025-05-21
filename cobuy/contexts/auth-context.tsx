import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { OneSignal } from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const restoreSession = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
        setIsLoggedIn(true);
        OneSignal.login(storedUsername);
      }
      setIsAuthReady(true);
    };
    restoreSession();
  }, []);


  const login = async (username: string, password: string) => {
    try {
      await axios.post('https://cobuy.up.railway.app/api/login', { username, password });

      setIsLoggedIn(true);
      setUsername(username);

      // 儲存 username 給 OneSignal 使用（App 初始化時可以抓到）
      await AsyncStorage.setItem('username', username);

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
      await axios.post('http://cobuy.up.railway.app:8081/api/register', {
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

  const logout = async () => {
    setIsLoggedIn(false);
    setUsername(null);
    await AsyncStorage.removeItem('username');
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
