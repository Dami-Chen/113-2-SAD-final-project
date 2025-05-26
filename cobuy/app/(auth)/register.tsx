import { useState } from 'react'
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth, RegisterFormType } from '../../contexts/auth-context'

export default function Register() {
  const router = useRouter()
  const { register } = useAuth()

  const [form, setForm] = useState<RegisterFormType>({
    username: '',
    password: '',
    nickname: '',
    real_name: '',
    email: '',
    school: '',
    student_id: '',
    dorm: '',
    phone: '',
    score: 5,
  })

  const handleChange = (key: keyof RegisterFormType, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleRegister = async () => {
    const { username, password, nickname, real_name } = form
    if (!username || !password || !nickname || !real_name) {
      alert('請填寫必填欄位')
      return
    }

    await register(form)
    router.replace('/(auth)/login')
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-primary px-8 pt-20 pb-10">
      <Text className="text-3xl font-bold text-dark text-center mb-8">註冊帳號</Text>

      <TextInput
        placeholder="使用者名稱"
        placeholderTextColor="#8D6F60"
        value={form.username}
        onChangeText={text => handleChange('username', text)}
        className="bg-block rounded-lg py-3 px-4 text-base text-dark mb-4"
      />

      <TextInput
        placeholder="密碼"
        placeholderTextColor="#8D6F60"
        secureTextEntry
        value={form.password}
        onChangeText={text => handleChange('password', text)}
        className="bg-block rounded-lg py-3 px-4 text-base text-dark mb-4"
      />

      <TextInput
        placeholder="暱稱"
        placeholderTextColor="#8D6F60"
        value={form.nickname}
        onChangeText={text => handleChange('nickname', text)}
        className="bg-block rounded-lg py-3 px-4 text-base text-dark mb-4"
      />

      <TextInput
        placeholder="真實姓名"
        placeholderTextColor="#8D6F60"
        value={form.real_name}
        onChangeText={text => handleChange('real_name', text)}
        className="bg-block rounded-lg py-3 px-4 text-base text-dark mb-4"
      />

      <TextInput
        placeholder="電子郵件"
        placeholderTextColor="#8D6F60"
        keyboardType="email-address"
        value={form.email}
        onChangeText={text => handleChange('email', text)}
        className="bg-block rounded-lg py-3 px-4 text-base text-dark mb-4"
      />

      <TextInput
        placeholder="學校"
        placeholderTextColor="#8D6F60"
        value={form.school}
        onChangeText={text => handleChange('school', text)}
        className="bg-block rounded-lg py-3 px-4 text-base text-dark mb-4"
      />

      <TextInput
        placeholder="學號"
        placeholderTextColor="#8D6F60"
        value={form.student_id}
        onChangeText={text => handleChange('student_id', text)}
        className="bg-block rounded-lg py-3 px-4 text-base text-dark mb-4"
      />

      <TextInput
        placeholder="宿舍名稱"
        placeholderTextColor="#8D6F60"
        value={form.dorm}
        onChangeText={text => handleChange('dorm', text)}
        className="bg-block rounded-lg py-3 px-4 text-base text-dark mb-4"
      />

      <TextInput
        placeholder="電話"
        placeholderTextColor="#8D6F60"
        keyboardType="phone-pad"
        value={form.phone}
        onChangeText={text => handleChange('phone', text)}
        className="bg-block rounded-lg py-3 px-4 text-base text-dark mb-6"
      />

      <Pressable onPress={handleRegister} className="bg-secondary py-3 rounded-lg items-center shadow">
        <Text className="text-primary text-lg font-bold">註冊</Text>
      </Pressable>

      <Pressable onPress={() => router.replace('/(auth)/login')} className="mt-6 items-center">
        <Text className="text-dark underline">已有帳號？前往登入</Text>
      </Pressable>
    </ScrollView>
  )
}
