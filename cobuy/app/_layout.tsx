// import { Stack } from "expo-router";
// import { Slot, useRouter, useSegments } from 'expo-router'
// import { useEffect, useState } from 'react'
// import { AuthProvider, useAuth } from '../contexts/auth-context'  
// // import './globals.css';

// function AuthGate() {
//   const { isLoggedIn } = useAuth()
//   const segments = useSegments()
//   const router = useRouter()

//   useEffect(() => {
//     const inAuthGroup = segments[0] === '(auth)'

//     if (!isLoggedIn && !inAuthGroup) {
//       router.replace('/(auth)/login')
//     }

//     if (isLoggedIn && inAuthGroup) {
//       router.replace('/(tabs)')
//     }
//   }, [isLoggedIn, segments])

//   return <Slot />
// }

// export default function RootLayout() {
//   return (
//     <AuthProvider>
//       <AuthGate />
//     </AuthProvider>
//   )
// }

import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '../contexts/auth-context';
import './globals.css';

import { OneSignal } from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';

import useOrderWebSocket from './hooks/useOrderWebSocket'; 
import { Alert } from 'react-native';

function AuthGate() {
  const { isLoggedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const [isNavigationReady, setNavigationReady] = useState(false);

  // 讓 React Router 完成 hydration 再做導向
  useEffect(() => {
    const timeout = setTimeout(() => {
      setNavigationReady(true);
    }, 0); // 下一個 tick 再執行

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isNavigationReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isLoggedIn && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isLoggedIn && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, segments, isNavigationReady]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppInitializer />
    </AuthProvider>
  );
}

// 新增 OneSignal 初始化邏輯
function AppInitializer() {
  const { isLoggedIn, username } = useAuth();

  useEffect(() => {
  OneSignal.initialize('3075acf3-0518-4ac3-9aeb-c1115ab2fb05');
  OneSignal.User.addTag('disable_analytics', 'true');

  async function requestPermission() {
    try {
      const granted = await OneSignal.Notifications.requestPermission(true);
      console.log('推播權限是否授予:', granted);
    } catch (error) {
      console.warn('推播權限請求失敗:', error);
    }
  }

  requestPermission();

}, [isLoggedIn]);

// ★★★ 這一行是重點！！只要登入就自動全域監聽 WebSocket 新通知
  useOrderWebSocket(isLoggedIn ? username : null);

  return <AuthGate />;
}
