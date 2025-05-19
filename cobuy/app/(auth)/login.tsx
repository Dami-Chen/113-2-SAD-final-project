import { View, Text, TextInput, Pressable } from 'react-native'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/auth-context'
import { useRouter } from 'expo-router';
import { OneSignal } from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const router = useRouter();

  const handleLogin = () => {
  if (username && password) {
    login(username, password);
  } else {
    alert('請輸入帳號與密碼');
  }
};

  return (
    <View className="flex-1 justify-center bg-primary px-8">
      <Text className="text-3xl font-bold text-dark text-center mb-8">登入</Text>

      <TextInput
        placeholder="帳號"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#8D6F60"
        className="bg-block rounded-lg py-3 px-4 text-base text-dark mb-4"
      />

      <TextInput
        placeholder="密碼"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#8D6F60"
        className="bg-block rounded-lg py-3 px-4 text-base text-dark mb-4"
      />

      <Pressable onPress={handleLogin} className="bg-secondary py-3 rounded-lg items-center shadow">
        <Text className="text-primary text-lg font-bold">登入</Text>
      </Pressable>

      <Pressable onPress={() => router.replace('/(auth)/register')} className="mt-6 items-center">
        <Text className="text-dark underline">沒有帳號？前往註冊</Text>
      </Pressable>
    </View>
  )
}