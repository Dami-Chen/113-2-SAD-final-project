import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth, OrderFormType } from '../../contexts/auth-context';  // Adjust path as needed
import axios from 'axios';

export default function CreateOrder(){
  const [closingMethod, setClosingMethod] = useState<'quantity' | 'datetime'>('quantity');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const router = useRouter();
  const { createOrder } = useAuth();

  const [form, setForm] = useState<OrderFormType>({
    order_id: '',
    host_username: '',
    item_name: '',
    quantity: '',
    total_price: '',
    unit_price: '',
    imageUrl: '',
    information: '',
    share_method: '',
    share_location: '',
    stop_at_num: '',
    stop_at_date: '',
    comment: '',
    hashtag: '',
    paymentMethod: ''
  });

  const handleChange = (key: keyof OrderFormType, value: string) => {
    let newValue: any = value;
    if (key === 'quantity' || key === 'total_price' || key === 'unit_price' || key === 'stop_at_num') {
      // Convert numeric fields from string to number
      newValue = value === '' ? 0 : Number(value);
    } else if (key === 'stop_at_date') {
      // Convert string to Date, assuming format 'YYYY-MM-DD'
      newValue = value ? new Date(value) : new Date();
    }

    setForm(prev => ({ ...prev, [key]: newValue }));
  };
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
  
    if (!form.item_name) {
      Alert.alert('錯誤', '請輸入團購物品名稱');
      return;
    }
    setLoading(true);

    await createOrder(form);
    router.replace('/(tabs)/history_order'); // 註冊完導去登入

  };

  
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.title}>發起團購</Text>

      <TextInput
        placeholder="輸入團購物品名稱"
        style={styles.input}
        value={form.item_name}
        onChangeText={text => handleChange('item_name', text)}
      />

      <View style={styles.row}>
        <TextInput
          placeholder="物品數量"
          style={[styles.input, styles.flex1]}
          keyboardType="numeric"
          value={form.quantity.toString()}
          onChangeText={text => handleChange('quantity', text)}
        />
        <TextInput
          placeholder="物品總價"
          style={[styles.input, styles.flex1]}
          keyboardType="numeric"
          value={form.total_price.toString()}
          onChangeText={text => handleChange('total_price', text)}
        />
        <TextInput
          placeholder="團購單價"
          style={[styles.input, styles.flex1]}
          keyboardType="numeric"
          value={form.unit_price.toString()}
          onChangeText={text => handleChange('unit_price', text)}
        />
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
        value={form.information}
        onChangeText={text => handleChange('information', text)}
      />

      <View style={styles.row}>
        <TextInput
          placeholder="分送方式 e.g. 單包裝"
          style={[styles.input, styles.flex1]}
          value={form.share_method}
          onChangeText={text => handleChange('share_method', text)}
        />
        <TextInput
          placeholder="分送地點"
          style={[styles.input, styles.flex1]}
          value={form.share_location}
          onChangeText={text => handleChange('share_location', text)}
        />
      </View>

      <Text style={{ marginBottom: 4, color: '#333' }}>結單方式</Text>
      <View style={styles.radioRow}>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => {
            setClosingMethod('quantity');
            setShowDatePicker(false);
            setForm(prev => ({ ...prev, stop_at_num: 0 }));
          }}
        >
          <View style={styles.radioCircle}>
            {closingMethod === 'quantity' && <View style={styles.radioDot} />}
          </View>
          <Text style={styles.radioText}>數量達到上限</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => {
            setClosingMethod('datetime');
            setShowDatePicker(true);
            setForm(prev => ({ ...prev, stop_at_num: 0 }));
          }}
        >
          <View style={styles.radioCircle}>
            {closingMethod === 'datetime' && <View style={styles.radioDot} />}
          </View>
          <Text style={styles.radioText}>設定截止時間</Text>
        </TouchableOpacity>
      </View>

      

    {closingMethod === 'quantity' && (
        <TextInput
          placeholder="設定人數上限"
          style={styles.input}
          keyboardType="numeric"
          value={form.stop_at_num === 0 ? '' : form.stop_at_num.toString()}
          onChangeText={text => handleChange('stop_at_num', text)}
        />
    )}

      <TextInput
        placeholder="備註欄"
        style={styles.input}
        value={form.comment}
        onChangeText={text => handleChange('comment', text)}
      />
      <TextInput
        placeholder="支付方式（例如：現金）"
        style={styles.input}
        value={form.paymentMethod}
        onChangeText={text => handleChange('paymentMethod', text)}
      />

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={handleSubmit}  
      >
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
  radioRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    marginTop: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6c4d3f',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6c4d3f',
  },
  radioText: {
    fontSize: 14,
    color: '#333',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: '#fff', // 強制背景色
  },
});

/*
{showDatePicker && (
      <View style={{ marginBottom: 12 }}>
        <Text style={{ marginBottom: 4, color: '#333' }}>選擇截止時間</Text>
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="datetime"
          display="default"
          onChange={(event, date) => {
            if (event.type === 'set' && date) {
              setSelectedDate(date); // for display
              setForm(prev => ({ ...prev, stop_at_date: date })); // actually set it only when confirmed
            }
          }}
        />
        {selectedDate && (
        <Text style={{ color: '#666', marginTop: 8 }}>
          已選擇截止時間：{selectedDate.toLocaleString()}
        </Text>
      )}
      </View>
      )}
*/ 

