import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Alert, TextInput, Modal } from 'react-native';
import { useState } from 'react';


const ParticipantInfo = () => {
  const { id, orderId, order } = useLocalSearchParams();
  let parsedOrder;
  try {
    parsedOrder = JSON.parse(decodeURIComponent(order));
    parsedOrder.createdAt = new Date(parsedOrder.createdAt);
    parsedOrder.deadline = new Date(parsedOrder.deadline);
  } catch (e) {
    console.error('解析 order 失敗：', order);
    parsedOrder = null;
  }

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

  const [showReasonModal, setShowReasonModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  return (
    <>
        <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color="#6c4d3f" />
      </TouchableOpacity>

      <Text style={styles.header}>拼單者信息</Text>

      <View style={styles.row}>
        <View>
          <Text style={styles.label}>姓名：{participant.name}</Text>
          <Text style={styles.label}>聯絡方式：{participant.contact}</Text>
          <Text style={styles.label}>拼單物品：{parsedOrder.name}</Text>
          <Text style={styles.label}>拼單數量：{participant.quantity}</Text>
        </View>
        <View style={styles.creditCircle}>
          <Text style={styles.creditScore}>{participant.credit}</Text>
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
                  // 可在這裡呼叫 API 或執行後續動作
                  Alert.alert('已提交棄單原因', cancelReason);
                  setCancelReason('');
                  router.replace(`/(stack)/open_order_detail?id=${orderId}&data=${encodeURIComponent(order)}`);
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

export default ParticipantInfo;
