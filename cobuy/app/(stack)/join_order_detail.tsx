import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Alert, TextInput, Modal } from 'react-native';
import { useState } from 'react';


const JoinOrderDetail = () => {
  const router = useRouter();

  const [showReasonModal, setShowReasonModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const { data } = useLocalSearchParams();
  const order = JSON.parse(data);
  order.createdAt = new Date(order.createdAt);
  order.deadline = new Date(order.deadline);  


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
    <>
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.replace('/(tabs)/history_order?tab=join')} style={styles.backButton}>
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
        <View style={styles.imageBox}>
          <Ionicons name="image-outline" size={32} color="#6c4d3f" />
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

      <View style={styles.progressWrapper}>
        <View style={[styles.progressFill, { width: `${progressRatio * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>
        {order.closingMethod === 'quantity'
          ? `目前 ${order.current} / ${order.max} 人`
          : `距離截止剩下 ${(100 - progressRatio * 100).toFixed(0)}% 時間`}
      </Text>


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
      
{/* 取貨按鈕可刪=============================================================== */}      
      <TouchableOpacity
        style={styles.okBtn}
        onPress={() => {
        router.push('/(tabs)/history_order?tab=open');
        }}
        >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>拼單者已取貨</Text>
      </TouchableOpacity>
{/* 取貨按鈕可刪=============================================================== */}

      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            '確認標示為棄單',
            '確定要將此團購標示為棄單嗎？',
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
                  router.replace('/(tabs)/history_order?tab=join');
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
  //取貨按鈕可刪===============================================================
  okBtn: {
    marginTop: 60,
    backgroundColor: '#c59b86',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBox: {
    marginTop: 20,
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

export default JoinOrderDetail;
