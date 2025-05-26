'use client';

import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

export default function UserInfoScreen() {
  const router = useRouter();
  const [avatarUri, setAvatarUri] = useState(null);
  const [username, setUsername] = useState('');
  const [realName, setRealName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [studentId, setStudentId] = useState('');
  const [dorm, setDorm] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch('https://your-api-url.com/api/updateProfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          realName,
          email,
          school,
          studentId,
          dorm,
          avatar: avatarUri,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('成功', '資料已更新');
      } else {
        Alert.alert('錯誤', data.message || '更新失敗');
      }
    } catch (error) {
      Alert.alert('錯誤', '發生錯誤，請稍後再試');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>{'< 返回'}</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <TouchableOpacity style={styles.avatarCircle} onPress={pickImage}>
          <Image
            source={
              avatarUri
                ? { uri: avatarUri }
                : require('../../assets/images/profile-placeholder.png')
            }
            style={styles.avatar}
          />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <TextInput
            style={styles.username}
            placeholder="用戶名"
            value={username}
            onChangeText={setUsername}
          />
          <Text style={styles.credits}>信用分數：？</Text>
        </View>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>真實姓名</Text>
        <TextInput style={styles.input} placeholder="" value={realName} onChangeText={setRealName} />

        <Text style={styles.label}>E-Mail</Text>
        <TextInput style={styles.input} placeholder="" value={email} onChangeText={setEmail} />

        <Text style={styles.label}>學校</Text>
        <TextInput style={styles.input} placeholder="" value={school} onChangeText={setSchool} />

        <Text style={styles.label}>學號</Text>
        <TextInput style={styles.input} placeholder="" value={studentId} onChangeText={setStudentId} />

        <Text style={styles.label}>宿舍</Text>
        <TextInput style={styles.input} placeholder="" value={dorm} onChangeText={setDorm} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>修改</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF8F0',
    padding: 20,
    flexGrow: 1,
  },
  backButton: {
    marginBottom: 10,
    marginTop: 30,
  },
  backText: {
    fontSize: 18,
    color: '#8B6E5C',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#F2E6D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
    resizeMode: 'cover',
  },
  userInfo: {
    marginLeft: 20,
    justifyContent: 'center',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B6E5C',
  },
  credits: {
    fontSize: 16,
    color: '#8B6E5C',
    marginTop: 4,
  },
  form: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B6E5C',
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F2E6D8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#8B6E5C',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
