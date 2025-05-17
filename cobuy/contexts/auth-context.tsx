// // // contexts/auth-context.tsx
// import React, { createContext, useContext, useState, ReactNode } from 'react';

// // Define a type for the context value
// interface AuthContextType {
//   isLoggedIn: boolean;
//   login: () => void;
//   logout: () => void;
// }

// // Create the actual context (default value: null)
// const AuthContext = createContext<AuthContextType | null>(null);

// // Create a Provider component
// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(true);

//   const login = () => {
//     setIsLoggedIn(true);
//   };

//   const logout = () => {
//     setIsLoggedIn(false);
//   };

//   const value = { isLoggedIn, login, logout };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// Create a hook for easy usage
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used inside an AuthProvider');
//   }
//   return context;
// };

// ================================================================================

// // contexts/auth-context.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
  isLoggedIn: boolean;
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

  const login = async (username: string, password: string) => {
    try {
      await axios.post('http://<your IP>:3001/api/login', { username, password });
      setIsLoggedIn(true);
    } catch (err: any) {
      alert(err.response?.data?.error || '登入失敗');
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
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside an AuthProvider');
  return context;
};
