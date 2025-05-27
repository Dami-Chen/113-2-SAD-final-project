import React, { useEffect, useState }  from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth, OrderFormType, JoinOrderType, RegisterFormType } from '../../contexts/auth-context';  // Adjust path as needed
import axios from 'axios';

export default function JoinOrderDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams() as {id: string};
  const { username, openOrderDetail, openJoinDetail, getParticipantByOrder, getHostInfo} = useAuth();
  const [order, setOrder] = useState<OrderFormType | null>(null);
  const [participants, setParticipants] = useState<JoinOrderType[]>([]);
  const [hostInfo, setHostInfo] = useState<RegisterFormType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [progressRatio, setProgressRatio] = useState<number>(0)



  useEffect(() => {
    const fetchDetail = async () => {
      if (!username || !id) {
        setError('無使用者名稱或訂單ID');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const order = (await openJoinDetail(id!)) as unknown as OrderFormType[];
        console.log('🔍 openJoinDetail response', order);
        setOrder(order[0] || null);
        console.log('🔍 getHostInfo response', order[0].host_username)
        if (order[0]?.host_username) {
            const host = await getHostInfo(order[0].host_username) as unknown as RegisterFormType;
            console.log('🔍 getHostInfo response', host);
            setHostInfo(host || null);
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
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
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
        <View style={styles.imageBox}>
          <Ionicons name="image-outline" size={32} color="#6c4d3f" />
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


      <View style={styles.progressWrapper}></View>


      <View style={styles.row}>
        <Text style={[styles.label, { fontWeight: 'bold' }]}>團主信息</Text>
        <Text style={[styles.label, { fontWeight: 'bold' }]}>信用分數</Text>
      </View>

      <View style={styles.row}>
        <View>
          <Text style={styles.label}>姓名：{hostInfo?.username}</Text>
          <Text style={styles.label}>聯絡方式：{hostInfo?.phone}</Text>
        </View>
        <View style={styles.creditCircle}>
          <Text style={styles.creditScore}>{hostInfo?.score}</Text>
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
  progressWrapper: {
    height: 20,
    backgroundColor: '#efdfce',
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#c59b86',
  },
  progressText: {
    textAlign: 'center',
    color: '#6c4d3f',
    fontWeight: '600',
    marginBottom: 12,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#6c4d3f',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: '#fdfdfd',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 20,
  },
  modalCancel: {
    color: '#999',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalConfirm: {
    color: '#c00',
    fontWeight: 'bold',
    fontSize: 16,
  },

});