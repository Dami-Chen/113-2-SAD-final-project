import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CreateOrder = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.title}>發起團購</Text>

      <TextInput placeholder="輸入團購物品名稱" style={styles.input} />

      <View style={styles.row}>
        <TextInput placeholder="物品數量" style={[styles.input, styles.flex1]} keyboardType="numeric" />
        <TextInput placeholder="物品總價" style={[styles.input, styles.flex1]} keyboardType="numeric" />
        <TextInput placeholder="團購單價" style={[styles.input, styles.flex1]} keyboardType="numeric" />
      </View>

      <TouchableOpacity style={styles.uploadBox}>
        <Ionicons name="cloud-upload-outline" size={24} color="#666" />
        <Text style={{ color: '#666' }}> 上傳照片 </Text>
      </TouchableOpacity>

      <TextInput
        placeholder="輸入商品資訊"
        style={[styles.input, { height: 80 }]}
        multiline
        textAlignVertical="top"
      />

      <View style={styles.row}>
        <TextInput placeholder="分送方式 e.g. 單包裝" style={[styles.input, styles.flex1]} />
        <TextInput placeholder="分送地點" style={[styles.input, styles.flex1]} />
      </View>

      <TextInput placeholder="結單方式（例如：數量到達上限）" style={styles.input} />
      <TextInput placeholder="備註欄" style={styles.input} />
      <TextInput placeholder="支付方式（例如：現金）" style={styles.input} />

      <TouchableOpacity style={styles.submitBtn}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>確認發起團購</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf7ef',
    padding: 16,
  },
  title: {
    marginBottom: 12,
    fontSize: 20,
    fontWeight: '700',
    color: '#6c4d3f',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  flex1: {
    flex: 1,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#d2bda9',
    backgroundColor: '#f5ece3',
    borderRadius: 8,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  submitBtn: {
    backgroundColor: '#c59b86',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
});

export default CreateOrder;
