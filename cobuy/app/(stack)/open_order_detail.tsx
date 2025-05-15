import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const OrderDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // 範例拼單者
  const participants = [
    { id: '1', name: '小美', quantity: 1, contact: '0912345678', credit: 5 },
    { id: '2', name: '阿宏', quantity: 2, contact: '0987654321', credit: 4 },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <TouchableOpacity onPress={() => router.replace('/(tabs)/history_order?tab=open')} style={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color="#6c4d3f" />
      </TouchableOpacity>
      <Text style={styles.title}>團購物品名稱</Text>

      <View style={styles.row}>
        <View style={styles.inputBox}>
          <Text style={styles.label}>物品數量</Text>
          <Text style={styles.value}>5</Text>
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.label}>團購單價</Text>
          <Text style={styles.value}>$100</Text>
        </View>
      </View>

      <Text style={styles.label}>商品資訊</Text>
      <Text style={styles.textArea}>這是商品資訊的範例文字...</Text>

      <View style={styles.row}>
        <View style={styles.inputBox}>
          <Text style={styles.label}>分送方式</Text>
          <Text style={styles.value}>統一配送</Text>
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.label}>分送地點</Text>
          <Text style={styles.value}>台北車站</Text>
        </View>
      </View>

      <Text style={styles.label}>結單方式</Text>
      <Text style={styles.value}>滿 5 人</Text>

      <View style={styles.progressBar} />

      <Text style={[styles.label, { marginTop: 16 }]}>拼單人數：2</Text>

      {participants.map(p => (
        <TouchableOpacity
          key={p.id}
          style={styles.participantCard}
          onPress={() => router.push(`/(stack)/participant_info?id=${p.id}&orderId=${id}`)}
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

});

export default OrderDetail;
