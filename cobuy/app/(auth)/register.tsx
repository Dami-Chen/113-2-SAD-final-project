import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Pressable, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth, RegisterFormType } from '../../contexts/auth-context';

const dormList = ['女一舍', '女二舍', '女三舍', '女四舍', '女五舍', '女六舍', '女八舍', '女九舍', '男一舍', '男二舍',
    '男三舍', '男四舍', '男五舍', '男六舍', '男七舍', '男八舍', '男九舍', '長興BOT', '水源BOT'];



export default function Register() {
  const router = useRouter();
  const { form, setRegisterForm, register } = useAuth();

  const [showDormModal, setShowDormModal] = useState(false);
  const [selectedDorm, setSelectedDorm] = useState('');

  const [agree, setAgree] = useState(false);

  const handleChange = (key: keyof RegisterFormType, value: string) => {
    setRegisterForm(prev => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    const { username, password, real_name, email, school, student_id, dorm} = form;

    if (!username || !password || !real_name || !email || !school || !student_id || !dorm) {
      Alert.alert('請填寫必填欄位');
      return;
    }

    if (!/@.+\.edu\.tw$/.test(email)) {
      Alert.alert('請輸入有效的學校信箱');
      return;
    }

    if (!agree) {
      Alert.alert('請閱讀並同意用戶條款');
      return;
    }

    await register(form);
    router.replace('/(auth)/login'); // 註冊完導去登入
  };

  return (
    <>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-primary px-8 pt-20 pb-10">
        <Text className="text-3xl font-bold text-dark text-center mb-8">註冊帳號</Text>

        <TextInput
          placeholder="使用者名稱 (必填)"
          placeholderTextColor="#8D6F60"
          value={form.username}
          onChangeText={text => handleChange('username', text)}
          className="bg-block rounded-lg py-3 px-4 text-base text-dark mb-4"
        />

        <TextInput
          placeholder="密碼 (必填)"
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
          placeholder="電子郵件 (必填) (請填學校信箱)"
          placeholderTextColor="#8D6F60"
          keyboardType="email-address"
          value={form.email}
          onChangeText={text => handleChange('email', text)}
          className="bg-block rounded-lg py-3 px-4 text-base text-dark mb-4"
        />

        <TextInput
          placeholder="學校 (必填) (e.g.NTU)"
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

        <Pressable
          onPress={() => setShowDormModal(true)}
          className="bg-block rounded-lg py-3 px-4 text-base text-dark mb-4"
        >
          <Text style={{ color: form.dorm ? '#4B3A34' : '#8D6F60' }}>
            {form.dorm || '宿舍名稱 (必填)'}
          </Text>
        </Pressable>


        <TextInput
          placeholder="電話"
          placeholderTextColor="#8D6F60"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={text => handleChange('phone', text)}
          className="bg-block rounded-lg py-3 px-4 text-base text-dark mb-6"
        />

        {/* 條款同意區 */}
        <View className="flex-row items-center mb-6">
          <Pressable
            onPress={() => setAgree(!agree)}
            className={`w-5 h-5 border-2 mr-2 rounded items-center justify-center ${
              agree ? 'bg-secondary border-secondary' : 'border-dark bg-white'
            }`}
          >
            {agree && <Text className="text-white text-xs">✓</Text>}
          </Pressable>
          <Text className="text-dark text-sm">
            我已閱讀並同意
            <Text
              className="text-blue-600 underline"
              onPress={() => router.push('/(auth)/terms')} 
            >
              《用戶使用同意條款暨免責聲明》
            </Text>
          </Text>
        </View>

        {/* 註冊按鈕變成灰色（未勾選時） */}
        <Pressable
          onPress={handleRegister}
          disabled={!agree}
          className={`py-3 rounded-lg items-center shadow ${agree ? 'bg-secondary' : 'bg-gray-400'}`}
        >
          <Text className="text-primary text-lg font-bold">註冊</Text>
        </Pressable>

        <Pressable onPress={() => router.replace('/(auth)/login')} className="mt-6 items-center">
          <Text className="text-dark underline">已有帳號？前往登入</Text>
        </Pressable>
      </ScrollView>

      <Modal
        visible={showDormModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowDormModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>請選擇宿舍</Text>
            {dormList.map(dorm => (
              <Pressable
                key={dorm}
                onPress={() => {
                  setSelectedDorm(dorm);
                  setRegisterForm(prev => ({ ...prev, dorm }));
                  setShowDormModal(false);
                }}
                style={{ paddingVertical: 10 }}
              >
                <Text style={{ fontSize: 16 }}>{dorm}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </>
    )
}
