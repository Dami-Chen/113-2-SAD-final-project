import { Stack } from "expo-router";
import { Slot, useRouter, useSegments } from 'expo-router'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from '../contexts/auth-context'  
import './globals.css';

function AuthGate() {
  const { isLoggedIn } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)'

    if (!isLoggedIn && !inAuthGroup) {
      router.replace('/(auth)/login')
    }

    if (isLoggedIn && inAuthGroup) {
      router.replace('/(tabs)')
    }
  }, [isLoggedIn, segments])

  return <Slot />
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  )
}