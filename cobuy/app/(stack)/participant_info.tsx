import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ParticipantInfo = () => {
  const { id, orderId } = useLocalSearchParams();
  const router = useRouter();

  // 模擬從 orderId 找出參加者名單，再從中找出這位參加者
  const participants = [
    { id: '1', name: '小美', quantity: 1, contact: '0912345678', credit: 5 },
    { id: '2', name: '阿宏', quantity: 2, contact: '0987654321', credit: 4 },
  ];

  const participant = participants.find(p => p.id === id);

  if (!participant) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>找不到參加者資料</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color="#6c4d3f" />
      </TouchableOpacity>

      <Text style={styles.header}>拼單者信息</Text>

      <View style={styles.row}>
        <View>
          <Text style={styles.label}>姓名：{participant.name}</Text>
          <Text style={styles.label}>聯絡方式：{participant.contact}</Text>
          <Text style={styles.label}>拼單物品：團購物品 {orderId}</Text>
          <Text style={styles.label}>拼單數量：{participant.quantity}</Text>
        </View>
        <View style={styles.creditCircle}>
          <Text style={styles.creditScore}>{participant.credit}</Text>
        </View>
      </View>

      <View style={styles.cancelBox}>
        <Text style={styles.cancelText}>標示為棄單</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdf7ef', padding: 24 },
  backButton: {
    marginTop: 50,
    marginBottom: 12,
  },
  header: {
    fontSize: 20, fontWeight: 'bold', color: '#6c4d3f',
    textAlign: 'center', marginBottom: 24,
  },
  label: { fontSize: 16, color: '#6c4d3f', marginBottom: 8 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  creditCircle: {
    width: 64, height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#8c6a5d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  creditScore: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8c6a5d',
  },
  cancelBox: {
    marginTop: 60,
    backgroundColor: '#fdd',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#c00',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ParticipantInfo;
