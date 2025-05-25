import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const OrderDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data } = useLocalSearchParams();
  const order = JSON.parse(data);
  order.createdAt = new Date(order.createdAt);
  order.deadline = new Date(order.deadline);  

  // 範例拼單者
  const participants = [
    { id: '1', name: '小美', quantity: 1, contact: '0912345678', credit: 5 },
    { id: '2', name: '阿宏', quantity: 2, contact: '0987654321', credit: 4 },
  ];

  const currentParticipants = participants.length;

  let progressRatio = 0;

  if (order.closingMethod === 'quantity') {
    progressRatio = order.current / order.max;
  } else if (order.closingMethod === 'datetime') {
    const now = new Date().getTime();
    const total = order.deadline.getTime() - order.createdAt.getTime();
    const remaining = order.deadline.getTime() - now;
    progressRatio = Math.max(0, Math.min(1, 1 - remaining / total));
  }



  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <TouchableOpacity onPress={() => router.replace('/(tabs)/history_order?tab=open')} style={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color="#6c4d3f" />
      </TouchableOpacity>
      <Text style={styles.title}>團購物品：{order.name}</Text>

      <View style={styles.row}>
        <View style={styles.inputBox}>
          <Text style={styles.label}>物品數量</Text>
          <Text style={styles.value}>{order.max}</Text>
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.label}>團購單價</Text>
          <Text style={styles.value}>${order.unitPrice}</Text>
        </View>
      </View>

      <Text style={styles.label}>商品資訊</Text>
      <Text style={styles.textArea}>{order.description}</Text>

      <View style={styles.row}>
        <View style={styles.inputBox}>
          <Text style={styles.label}>分送方式</Text>
          <Text style={styles.value}>{order.deliveryMethod}</Text>
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.label}>分送地點</Text>
          <Text style={styles.value}>{order.deliveryPlace}</Text>
        </View>
      </View>

      <Text style={styles.label}>結單方式</Text>
      <Text style={styles.value}>{order.closingMethodLabel}</Text>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBarFill, { width: `${progressRatio * 100}%` }]} />
      </View>

      <Text style={styles.progressText}>
        {order.closingMethod === 'quantity'
          ? `目前 ${order.current} / ${order.max} 個`
          : `距離截止剩下 ${(100 - progressRatio * 100).toFixed(0)}% 時間`}
      </Text>


      <Text style={[styles.label, { marginTop: 16 }]}>拼單人數：2</Text>

      {participants.map(p => (
        <TouchableOpacity
          key={p.id}
          style={styles.participantCard}
          onPress={() => router.push(`/(stack)/participant_info?id=${p.id}&orderId=${id}&order=${encodeURIComponent(JSON.stringify(order))}`)}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.participantName}>{p.name}</Text>
            <Text style={styles.participantSub}>拼單數量：{p.quantity}</Text>
            <Text style={styles.participantSub}>聯絡方式：{p.contact}</Text>
          </View>
          <Text style={styles.creditText}>信用分數 {p.credit}/5</Text>
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
  progressContainer: {
    height: 20,
    backgroundColor: '#efdfce',
    borderRadius: 999,
    overflow: 'hidden',
    marginVertical: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#c59b86',
  },
  progressText: {
    textAlign: 'center',
    color: '#6c4d3f',
    fontWeight: '600',
    marginBottom: 8,
  },

});

export default OrderDetail;
