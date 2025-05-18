import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const JoinOrderDetail = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color="#6c4d3f" />
      </TouchableOpacity>

      <Text style={styles.title}>團購物品名稱</Text>

      <View style={styles.row}>
        <View style={styles.inputBox}>
          <Text style={styles.label}>物品數量</Text>
          <Text style={styles.value}>1</Text>
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.label}>團購單價</Text>
          <Text style={styles.value}>$100</Text>
        </View>
        <View style={styles.imageBox}>
          <Ionicons name="image-outline" size={32} color="#6c4d3f" />
        </View>
      </View>

      <Text style={styles.label}>商品資訊</Text>
      <Text style={styles.textArea}>這是商品資訊...</Text>

      <View style={styles.row}>
        <View style={styles.inputBox}>
          <Text style={styles.label}>分送方式</Text>
          <Text style={styles.value}>統一包裝</Text>
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.label}>分送地點</Text>
          <Text style={styles.value}>台北車站</Text>
        </View>
      </View>

      <Text style={styles.label}>結單方式</Text>
      <Text style={styles.value}>人數到達上限</Text>

      <View style={styles.progressBar} />

      <View style={styles.row}>
        <Text style={[styles.label, { fontWeight: 'bold' }]}>團主信息</Text>
        <Text style={[styles.label, { fontWeight: 'bold' }]}>信用分數</Text>
      </View>

      <View style={styles.row}>
        <View>
          <Text style={styles.label}>姓名：</Text>
          <Text style={styles.label}>聯絡方式：</Text>
        </View>
        <View style={styles.creditCircle}>
          <Text style={styles.creditScore}>4</Text>
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
    marginBottom: 12 
  },
  title: {
    fontSize: 20, fontWeight: 'bold', color: '#6c4d3f',
    textAlign: 'center', marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputBox: { flex: 1, marginRight: 8 },
  label: { fontSize: 16, color: '#6c4d3f', marginBottom: 4 },
  value: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#fff',
  },
  textArea: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 8, backgroundColor: '#fff', height: 60, marginBottom: 12,
  },
  progressBar: {
    height: 20, backgroundColor: '#efdfce', borderRadius: 999,
    marginVertical: 12,
  },
  imageBox: {
    width: 60, height: 60, backgroundColor: '#efe3d6',
    borderRadius: 12, justifyContent: 'center', alignItems: 'center',
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
    marginTop: 30,
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

export default JoinOrderDetail;
