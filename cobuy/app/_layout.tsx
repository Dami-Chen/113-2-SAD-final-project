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

function AuthGate() {
  const { isLoggedIn } = useAuth()
  const segments = useSegments()
  const router = useRouter()
  const [isNavigationReady, setNavigationReady] = useState(false);

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
      <AuthGate />
    </AuthProvider>
  );
}
