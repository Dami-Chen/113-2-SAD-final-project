import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuth } from '../../contexts/auth-context'
import React from 'react';

const Profile = () => {
    const {logout} = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.title} className="text-secondary">個人資訊</Text>
            <Button title="登出" onPress={logout} />
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