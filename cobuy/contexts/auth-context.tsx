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

// // Create a hook for easy usage
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
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = async (username: string, password: string) => {
    try {
      await axios.post('http://192.168.230.248:3001/api/login', { username, password }); // 填自己的位址，形式像是：http://192.168.X.X:3001/api
      setIsLoggedIn(true);
    } catch (err: any) {
      alert(err.response?.data?.error || '登入失敗');
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside an AuthProvider');
  return context;
};
