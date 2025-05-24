import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth, RegisterFormType } from '../../contexts/auth-context';

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();

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
  });

  const handleChange = (key: keyof RegisterFormType, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    const { username, password, nickname, real_name } = form;

    if (!username || !password || !nickname || !real_name) {
      Alert.alert('請填寫必填欄位');
      return;
    }

    await register(form);
    router.replace('/(auth)/login'); // 註冊完導去登入
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>註冊帳號</Text>

      <TextInput style={styles.input} placeholder="使用者名稱" onChangeText={text => handleChange('username', text)} />
      <TextInput style={styles.input} placeholder="密碼" secureTextEntry onChangeText={text => handleChange('password', text)} />
      <TextInput style={styles.input} placeholder="暱稱" onChangeText={text => handleChange('nickname', text)} />
      <TextInput style={styles.input} placeholder="真實姓名" onChangeText={text => handleChange('real_name', text)} />
      <TextInput style={styles.input} placeholder="電子郵件" keyboardType="email-address" onChangeText={text => handleChange('email', text)} />
      <TextInput style={styles.input} placeholder="學校" onChangeText={text => handleChange('school', text)} />
      <TextInput style={styles.input} placeholder="學號" onChangeText={text => handleChange('student_id', text)} />
      <TextInput style={styles.input} placeholder="宿舍名稱" onChangeText={text => handleChange('dorm', text)} />
      <TextInput style={styles.input} placeholder="電話" keyboardType="phone-pad" onChangeText={text => handleChange('phone', text)} />

      <View style={styles.button}>
        <Button title="註冊" onPress={handleRegister} />
      </View>
      
      <View style={styles.button}>
        <Button title="已有帳號？前往登入" onPress={() => router.replace('/(auth)/login')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
});
