import { Stack } from "expo-router";
import { Slot, useRouter, useSegments } from 'expo-router'
import { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from '../contexts/auth-context'  
import './globals.css';

function AuthGate() {
  const { isLoggedIn } = useAuth()
  const [isNavigationReady, setNavigationReady] = useState(false);
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    const timeout = setTimeout(() => setNavigationReady(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isNavigationReady) return; // ✅ 等 navigation 準備好再 redirect
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
      <AuthGate />
    </AuthProvider>
  )
}