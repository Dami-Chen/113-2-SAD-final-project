import { View, Text, StyleSheet, Button, TouchableOpacity, Image } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useAuth } from '../../contexts/auth-context'
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

const Profile = () => {
    const { logout } = useAuth();
    const router = useRouter();

    const [userInfo, setUserInfo] = useState({ username: '', avatar: '' });

    

    return (
      <View style={styles.container} className="flex-1 bg-primary items-center pt-12">
        <View className="w-32 h-32 rounded-full bg-[#F1E6D8] justify-center items-center overflow-hidden">
          {userInfo.avatar ? (
            <Image source={{ uri: userInfo.avatar }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          ) : null}
        </View>
        <Text className="text-xl font-bold text-secondary mt-4 mb-4">{userInfo.username}</Text>

        <View className="flex-1 justify-start gap-4 w-full px-8 py-4">
          <TouchableOpacity onPress={() => router.push('/profile/info')}>
            <View className="bg-[#F1E6D8] flex-row items-center justify-between py-4 px-5 rounded-2xl">
              <View className="flex-row items-center">
                <Ionicons name="person-outline" size={24} color="#8B6D5C" />
                <Text className="text-xl text-secondary ml-2">個人資訊</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/history_order')}>
            <View className="bg-[#F1E6D8] flex-row items-center justify-between py-4 px-5 rounded-2xl">
              <View className="flex-row items-center">
                <Feather name="file-text" size={24} color="#8B6D5C" />
                <Text className="text-xl text-secondary ml-2">我的團購</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/profile/setting')}>
            <View className="bg-[#F1E6D8] flex-row items-center justify-between py-4 px-5 rounded-2xl">
              <View className="flex-row items-center">
                <Feather name="settings" size={24} color="#8B6D5C" />
                <Text className="text-xl text-secondary ml-2">設定</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View className="bg-[#8B6D5C] py-4 rounded-full items-center mt-4 mb-4">
          <Text onPress={logout} className="text-white text-lg font-bold">登出</Text>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
      padding: 16,          
    },
    title: {
      marginBottom: 12,     
      fontSize: 18,
      fontWeight: '600',
    },
  })

export default Profile