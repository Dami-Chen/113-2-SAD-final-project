import React, { useEffect, useState }  from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, OrderFormType, JoinOrderType, RegisterFormType } from '../../contexts/auth-context';  // Adjust path as needed
import axios from 'axios';
import { Alert, TextInput, Modal } from 'react-native';

export default function ParticipantInfo() {
  const { id: username, orderId } = useLocalSearchParams()as { id: string; orderId: string };
  const router = useRouter();
  const [participant, setParticipant] = useState<JoinOrderType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getParticipantByOrder, reportAbandon, username: authUsername } = useAuth();
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

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
    <>
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

      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            '確認標示為棄單',
            '確定要將此拼單者標示為棄單嗎？',
            [
              { text: '取消', style: 'cancel' },
              {
                text: '確認',
                onPress: () => setShowReasonModal(true),
              },
            ],
            { cancelable: true }
          );
        }}
        style={styles.cancelBox}
      >
        <Text style={styles.cancelText}>標示為棄單</Text>
      </TouchableOpacity>
    </View>

    <Modal visible={showReasonModal} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>請輸入棄單原因</Text>
          <TextInput
            value={cancelReason}
            onChangeText={setCancelReason}
            placeholder="例如：時間不合、無法付款..."
            multiline
            style={styles.modalInput}
          />
          <View style={styles.modalButtonRow}>
            <TouchableOpacity onPress={() => setShowReasonModal(false)}>
              <Text style={styles.modalCancel}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (cancelReason.trim()) {
                  setShowReasonModal(false);

                  if (!authUsername) {
                    Alert.alert('登入狀態異常，請重新登入');
                    return;
                  }

                  const payload = {
                    reporter_username: authUsername,
                    target_username: username,
                    order_id: Number(orderId),
                    reason: cancelReason,
                    reported_at: new Date().toISOString(),
                    status: 'pending',
                  };

                  reportAbandon(payload)
                    .then(() => {
                      Alert.alert('已提交棄單原因', cancelReason);
                      setCancelReason('');
                      router.replace(`/(stack)/open_order_detail?id=${orderId}`);
                    })
                    .catch((error) => {
                      Alert.alert('提交失敗', error.message || '無法送出報告');
                    });
                } else {
                  Alert.alert('請填寫原因');
                }
              }}
            >
              <Text style={styles.modalConfirm}>確認</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    </>
    


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


