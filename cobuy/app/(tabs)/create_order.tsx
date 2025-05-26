import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image, 
  Alert,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import type { ImagePickerAsset } from 'expo-image-picker';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';

const CreateOrder = () => {
  const [image, setImage] = useState<ImagePickerAsset | null>(null);
 
  const [closingMethod, setClosingMethod] = useState<'quantity' | 'datetime'>('quantity');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [category, setCategory] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [hashtagInput, setHashtagInput] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      setHashtags([]);  // ⬅️ 每次進來都清空
      return () => {};  // 可選：離開時做別的事
    }, [])
  );


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
        style={[styles.input, { height: 40 }]}
        multiline
        textAlignVertical="top"
      />

      <Text style={{ marginBottom: 4, color: '#333' }}>商品類別</Text>
      <TouchableOpacity
        style={[styles.input, { justifyContent: 'center' }]}
        onPress={() => setShowCategoryModal(true)}
      >
        <Text style={{ color: category ? '#000' : '#999' }}>
          {category || '請選擇商品類別'}
        </Text>
      </TouchableOpacity>

      <Text style={{ marginBottom: 4, color: '#333' }}>Hashtag 標籤</Text>
      <View style={styles.row}>
        <TextInput
          placeholder="輸入 hashtag"
          value={hashtagInput}
          onChangeText={setHashtagInput}
          style={[styles.inputHashtag, styles.flex1]}
        />
        <TouchableOpacity
          style={[styles.addButton]}
          onPress={() => {
            const trimmed = hashtagInput.trim();
            if (trimmed && !hashtags.includes(trimmed)) {
              setHashtags([...hashtags, trimmed]);
            }
            setHashtagInput('');
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>加入</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.hashtagContainer}>
        {hashtags.map((tag, index) => (
          <TouchableOpacity
            key={index}
            style={styles.hashtagBadge}
            onPress={() => {
              // 點擊標籤可移除
              setHashtags(hashtags.filter((_, i) => i !== index));
            }}
          >
            <Text style={styles.hashtagText}>#{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>


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


      <Modal visible={showCategoryModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {['生活用品', '生鮮食品', '熟食', '零食點心', '調味料', '其他'].map(option => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  setCategory(option);
                  setShowCategoryModal(false);
                }}
                style={styles.modalOption}
              >
                <Text style={{ fontSize: 16 }}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
              <Text style={{ textAlign: 'center', color: '#999', marginTop: 12 }}>取消</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    paddingVertical: 12,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  addButton: {
    backgroundColor: '#c59b86',
    height: 42,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    marginLeft: 8,
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 0,
    marginBottom: 8 ,
    gap: 8,
  },
  hashtagBadge: {
    backgroundColor: '#f2e3d5',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  hashtagText: {
    color: '#6c4d3f',
    fontWeight: '500',
  },
  inputHashtag: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },

});

export default CreateOrder;
