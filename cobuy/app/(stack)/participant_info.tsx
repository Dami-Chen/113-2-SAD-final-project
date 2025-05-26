import React, { useEffect, useState }  from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, OrderFormType, JoinOrderType, RegisterFormType } from '../../contexts/auth-context';  // Adjust path as needed
import axios from 'axios';


export default function ParticipantInfo() {
  const { id: username, orderId } = useLocalSearchParams()as { id: string; orderId: string };
  const router = useRouter();
  const [participant, setParticipant] = useState<JoinOrderType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {getParticipantByOrder} = useAuth();

  /*
  // 模擬從 orderId 找出參加者名單，再從中找出這位參加者
  const participants = [
    { id: '1', name: '小美', quantity: 1, contact: '0912345678', credit: 5 },
    { id: '2', name: '阿宏', quantity: 2, contact: '0987654321', credit: 4 },
  ];

  // const participant = participants.find(p => p.id === id);
  // */

  console.log('🔍 ParticipantInfo params:', { username, orderId });
  useEffect(() => {
    const fetchParticipant = async () => {
      if (!username || !orderId) {
      setError('缺少參加者ID或訂單ID');
      setLoading(false);
      return;
    }
      try {
        // 1. Get join info for this order
        const joins = (await getParticipantByOrder(orderId))  as unknown as JoinOrderType[];
        console.log('🔍 getParticipantByOrder response', joins);
        // 2. Find the join record for this participant
        const joinInfo = joins.find(j => j.username === username);
        if (!joinInfo) throw new Error('找不到參加者的拼單資料');

        // 4. Combine info and set state
        setParticipant({ username: joinInfo.username,
          phone: joinInfo.phone || '無',
          quantity: joinInfo.quantity,
          score: joinInfo.score || 0,
          order_id: orderId,
        } as JoinOrderType);

      } catch (err: any) {
        setError(err.message || '取得參加者資料失敗');
      } finally {
        setLoading(false);
      }
    };

    fetchParticipant();
  }, [username, orderId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>載入中...</Text>
      </View>
    );
  }

  if (error || !participant) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>{error || '找不到參加者資料'}</Text>
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
          <Text style={styles.label}>姓名：{participant?.username}</Text>
          <Text style={styles.label}>聯絡方式：{participant?.phone || '無'}</Text>
          <Text style={styles.label}>拼單物品：團購物品 {orderId}</Text>
          <Text style={styles.label}>拼單數量：{participant?.quantity}</Text>
        </View>
        <View style={styles.creditCircle}>
          <Text style={styles.creditScore}>{participant?.score ?? '-'}</Text>
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