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
import { useEffect, useState } from 'react';
import { useAuth, OrderFormType, JoinOrderType, RegisterFormType } from '../../contexts/auth-context';  // Adjust path as needed
import { useLocalSearchParams } from 'expo-router';


export default function UserInfoScreen() {
  const router = useRouter();
  const { from } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const { openUserInfo, username, getHostInfo, updateUserInfo} = useAuth();
  const [userInfo, setUserInfo] = useState<RegisterFormType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
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
    score: 0,
    });

  const [avatarUri, setAvatarUri] = useState(null);
  // const [username, setUsername] = useState('');
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
      setAvatarUri(null); 
      // result.assets[0].uri 
    }
  };
  const handleInputChange = (field: keyof RegisterFormType, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  useEffect(() => {
    const handleUpdate = async () => {
    console.log('🔍 username', username);
    try {
        if(username){
            const user = await getHostInfo(username) as RegisterFormType;
            console.log('🔍 getUserInfo response', user);
            setUserInfo(user);
            setForm(user);
        }
        
    
      /*const response = await fetch('https://your-api-url.com/api/updateProfile', {
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
      }*/
      
    } catch (err: any) {
        console.error('❌ Error loading order details:', err);
        setError(err.message || '無法取得訂單詳情');
    } finally {
      setLoading(false);
    }
  };
  handleUpdate();
  }, [username])
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        onPress={() => {
          if (from) {
            router.replace(from as `/profile` | `/profile/info` | `/profile/setting`); // 明確跳回
          } else if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/profile');
          }
        }}
      >
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
            value={form.username}
            editable={false}
            />
          <Text style={styles.credits}>信用分數：{form.score}</Text>
        </View>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>真實姓名</Text>
        <TextInput 
            style={styles.input} 
            placeholder="" 
            value={form.real_name || ""}
            editable={isEditing} 
            onChangeText={(text) => handleInputChange('real_name', text)}
            />

        <Text style={styles.label}>E-Mail</Text>
        <TextInput 
            style={styles.input} 
            placeholder="" 
            value={form.email || ""}
            editable={isEditing}
            onChangeText={(text) => handleInputChange('email', text)} 
        />

        <Text style={styles.label}>學校</Text>
        <TextInput     
            style={styles.input} 
            placeholder="" 
            value={form.school || ""}
            editable={isEditing}
            onChangeText={(text) => handleInputChange('school', text)}  
        />

        <Text style={styles.label}>學號</Text>
        <TextInput     
            style={styles.input} 
            placeholder="" 
            value={form.student_id|| ""}
            editable={isEditing}
            onChangeText={(text) => handleInputChange('student_id', text)}  
        />

        <Text style={styles.label}>宿舍</Text>
        <TextInput     
            style={styles.input} 
            placeholder="" 
            value={form.dorm || ""}
            editable={isEditing}
            onChangeText={(text) => handleInputChange('dorm', text)}  
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
            if (isEditing) {
                try {
                    setLoading(true);
                    // Simulate update API call
                    console.log('🔄 Saving info:', form);
                    
                    await updateUserInfo(form);
                    console.log('✅ updateUserInfo completed')
                    ;
                    Alert.alert("成功", "個人資料已更新");
                    setIsEditing(false);
                } catch (err) {
                    console.error("❌ Failed to update user info:", err);
                    Alert.alert("錯誤", "更新失敗，請稍後再試");
                } finally {
                    setLoading(false);
                }
            } else {
            setIsEditing(true);
            }
        }}
        >
        <Text style={styles.buttonText}>{isEditing ? "儲存" : "修改"}</Text>
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

/*
<TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>修改</Text>
      </TouchableOpacity>
*/