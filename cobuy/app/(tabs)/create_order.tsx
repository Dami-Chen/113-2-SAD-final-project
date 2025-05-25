import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import type { ImagePickerAsset } from 'expo-image-picker';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateOrder = () => {
  const [image, setImage] = useState<ImagePickerAsset | null>(null);
 
  const [closingMethod, setClosingMethod] = useState<'quantity' | 'datetime'>('quantity');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);



  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("需要權限", "請允許存取相簿才能上傳圖片。");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: false,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const uploadImage = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('photo', {
      uri: image.uri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any);

    try {
      const res = await axios.post('http://192.168.1.124:3001/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert('成功', '圖片已上傳');
    } catch (err) {
      Alert.alert('失敗', '圖片上傳失敗');
    }
  };
  const router = useRouter();
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.title}>發起團購</Text>

      <TextInput placeholder="輸入團購物品名稱" style={styles.input} />

      <View style={styles.row}>
        <TextInput placeholder="物品數量" style={[styles.input, styles.flex1]} keyboardType="numeric" />
        <TextInput placeholder="物品總價" style={[styles.input, styles.flex1]} keyboardType="numeric" />
        <TextInput placeholder="團購單價" style={[styles.input, styles.flex1]} keyboardType="numeric" />
      </View>

      <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
        <Ionicons name="cloud-upload-outline" size={24} color="#666" />
        <Text style={{ color: '#666' }}> 上傳照片 </Text>
      </TouchableOpacity>

      {image && (
        <Image
          source={{ uri: image.uri }}
          style={{ width: 200, height: 200, alignSelf: 'center', marginVertical: 10 }}
        />
      )}

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

      <Text style={{ marginBottom: 4, color: '#333' }}>結單方式</Text>

      <View style={styles.radioRow}>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => {
            setClosingMethod('quantity');
            setShowDatePicker(false);
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
          }}
        >
          <View style={styles.radioCircle}>
            {closingMethod === 'datetime' && <View style={styles.radioDot} />}
          </View>
          <Text style={styles.radioText}>設定截止時間</Text>
        </TouchableOpacity>
      </View>

    {showDatePicker && (
      <View style={{ marginBottom: 12 }}>
        <Text style={{ marginBottom: 4, color: '#333' }}>選擇截止時間</Text>
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="datetime"
          display="default"
          onChange={(event, date) => {
            if (event.type === 'set' && date) {
              setSelectedDate(date);
            }
          }}
        />
      </View>
    )}

      <TextInput placeholder="備註欄" style={styles.input} />
      <TextInput placeholder="支付方式（例如：現金）" style={styles.input} />

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={() => {
          router.push('/(tabs)/history_order?tab=open');
        }}
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

export default CreateOrder;
