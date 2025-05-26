import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, OrderFormType, JoinOrderType, RegisterFormType } from '../../contexts/auth-context';  // Adjust path as needed
import axios from 'axios';

export default function OrderDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams() as { id: string};
  const { username, openOrderDetail, getParticipantByOrder} = useAuth();
  const [order, setOrder] = useState<OrderFormType | null>(null);
  const [participants, setParticipants] = useState<JoinOrderType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!username || !id) {
        setError('無使用者名稱或訂單ID');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const orders = (await openOrderDetail(username!)) as unknown as OrderFormType[]; 
        console.log('🔍 openOrderDetail response', orders);
        const foundOrder = orders.find(order => String(order.order_id) === String(id));
        console.log('🔍 foundOrder', foundOrder);
        setOrder(foundOrder || null);

        if (foundOrder) {
          const joins = await getParticipantByOrder(id) as unknown as JoinOrderType[];
          console.log('🔍 order id', id);
          console.log('🔍 getParticipantByOrder response', joins);
          setParticipants(joins);
        }
          
        } catch (err: any) {
        console.error('❌ Error loading order details:', err);
        setError(err.message || '無法取得訂單詳情');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [username, id]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <TouchableOpacity onPress={() => router.replace('/(tabs)/history_order?tab=open')} style={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color="#6c4d3f" />
      </TouchableOpacity>
      <Text style={styles.title}>{order?.item_name || '團購物品名稱'}</Text>

      <View style={styles.row}>
        <View style={styles.inputBox}>
          <Text style={styles.label}>物品數量</Text>
          <Text style={styles.value}>{order?.quantity ?? '-'}</Text>
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.label}>團購單價</Text>
          <Text style={styles.value}>{order?.unit_price ? `$${order?.unit_price}` : '-'}</Text>
        </View>
      </View>

      <Text style={styles.label}>商品資訊</Text>
      <Text style={styles.textArea}>{order?.information || '無商品資訊'}</Text>

      <View style={styles.row}>
        <View style={styles.inputBox}>
          <Text style={styles.label}>分送方式</Text>
          <Text style={styles.value}>{order?.share_method || '-'}</Text>
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.label}>分送地點</Text>
          <Text style={styles.value}>{order?.share_location || '-'}</Text>
        </View>
      </View>

      <Text style={styles.label}>結單方式</Text>
      <Text style={styles.value}>{order?.stop_at_num !== null ? `滿 ${order?.stop_at_num} 人` : '未設定'}</Text>

      <View style={styles.progressBar} />

      <Text style={[styles.label, { marginTop: 16 }]}>拼單人數：{participants?.length}</Text>

      {participants?.map(p => (
        <TouchableOpacity
          key={p.username}
          style={styles.participantCard}
          onPress={() => router.push(`/(stack)/participant_info?id=${p.username}&orderId=${id}`)}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.participantName}>{p.username}</Text>
            <Text style={styles.participantSub}>拼單數量：{p.quantity}</Text>
            <Text style={styles.participantSub}>聯絡方式：{p.phone}</Text>
          </View>
          <Text style={styles.creditText}>信用分數 {p.score}/5</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdf7ef', padding: 16 },
  title: {
    fontSize: 20, fontWeight: 'bold', color: '#6c4d3f',
    textAlign: 'center', marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  inputBox: { flex: 1 },
  label: { color: '#6c4d3f', marginBottom: 4, fontWeight: '600' },
  value: {
    borderWidth: 1, borderColor: '#aaa', borderRadius: 8,
    padding: 8, backgroundColor: '#fdfdfd',
  },
  textArea: {
    borderWidth: 1, borderColor: '#aaa', borderRadius: 8,
    padding: 8, backgroundColor: '#fdfdfd', height: 60,
    marginBottom: 12,
  },
  progressBar: {
    height: 20, backgroundColor: '#efdfce', borderRadius: 999,
    marginVertical: 12,
  },
  participantCard: {
    backgroundColor: '#fff6f6', borderRadius: 12,
    padding: 16, marginBottom: 12,
    flexDirection: 'row',
  },
  participantName: { color: '#6c4d3f', fontWeight: 'bold', fontSize: 16 },
  participantSub: { color: '#666', fontSize: 14 },
  creditText: {
    color: '#6c4d3f',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  backButton: {
    marginTop: 50,
    marginBottom: 12,
  },

});


