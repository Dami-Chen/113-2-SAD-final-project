import { Slot, useRouter, useSegments } from 'expo-router'
import { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from '../contexts/auth-context'  
import './globals.css';

import OneSignal from 'react-native-onesignal';

function AuthGate() {
  const { isLoggedIn } = useAuth();
  const [isNavigationReady, setNavigationReady] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => setNavigationReady(true), 0);
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

  if (!isNavigationReady) return null;

  return <Slot />
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
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    // 初始化 OneSignal
    OneSignal.setAppId('3075acf3-0518-4ac3-9aeb-c1115ab2fb05');

    // 啟用通知權限（會自動判斷平台）
    OneSignal.promptForPushNotificationsWithUserResponse();

    // 登入狀態綁定用戶（OneSignal.login 必須是字串 ID）
    if (isLoggedIn) {
      // 你可能需要從 localStorage 或 context 抓 user.username
      // 假設你有 user.username，可以在這裡寫：
      const userId = localStorage.getItem('username'); // ← 根據你自己的邏輯調整
      if (userId) {
        OneSignal.login(userId);
      }
    }
  }, [isLoggedIn]);

  return <AuthGate />;
}
