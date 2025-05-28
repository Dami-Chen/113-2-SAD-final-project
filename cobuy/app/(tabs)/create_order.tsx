import React, { useEffect, useState } from 'react';
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
import * as ImagePicker from 'expo-image-picker';
import { Image, Modal } from 'react-native';




const initialFormState: OrderFormType = {
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
  stop_at_date: null,
  comment: '',
  hashtag: '',
  paymentMethod: '',
  labels:'',
};




export default function CreateOrder(){
  const [closingMethod, setClosingMethod] = useState<'quantity' | 'datetime'>('quantity');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [yearInput, setYearInput] = useState(String(new Date().getFullYear()));
  const [monthInput, setMonthInput] = useState(String(new Date().getMonth() + 1));
  const [dayInput, setDayInput] = useState(String(new Date().getDate()));
  // const [date, setDate] = useState({ stop_at_date: null });




  const router = useRouter();
  const { createOrder, username } = useAuth();
  const [form, setForm] = useState<OrderFormType>(initialFormState);
  const [loading, setLoading] = useState(false);




  const [avatarUri, setAvatarUri] = useState<string | null>(null);

 // 字的顏色
  const getPlaceholderColor = (text: string) => text.includes('*') ? '#6c4d3f' : '#999';

  const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setAvatarUri(result.assets[0].uri); // 記得設 uri
      }
  };
  const [category, setCategory] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [hashtagInput, setHashtagInput] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);








  const handleChange = (key: keyof OrderFormType, value: string) => {
    let newValue: any = value;
    if (key === 'quantity' || key === 'total_price' || key === 'unit_price' || key === 'stop_at_num') {
      // Convert numeric fields from string to number
      newValue = value === '' || value === null ? null : Number(value);
    } else if (key === 'stop_at_date') {
      // Convert string to Date, assuming format 'YYYY-MM-DD'
      newValue = value === '' ? null : new Date(value);
    }




    setForm(prev => ({ ...prev, [key]: newValue }));
  };




  const handleSubmit = async () => {

    if (!form.item_name) {
      Alert.alert('錯誤', '請輸入團購物品名稱');
      return;
    }
    setLoading(true);
    if(username)
      form.host_username = username
    // await createOrder(form);
    // router.replace('/(tabs)/history_order'); // 註冊完導去登入




    try {
      form.imageUrl = `../../assets/images/${form.item_name}.png`;
      console.log('📌 createOrder form:', form);
      await createOrder(form);
      Alert.alert('成功', '團購建立成功');




      // Reset form and related states
      setForm(initialFormState);
      setYearInput(String(new Date().getFullYear()));
      setMonthInput(String(new Date().getMonth() + 1));
      setDayInput(String(new Date().getDate()));
      setClosingMethod('quantity');
      setAvatarUri(null);
      setCategory('');
      setHashtagInput('');
      setHashtags([]);









      // Navigate to history_order page after clearing form
      router.replace('/(tabs)/history_order');
    } catch (err) {
      Alert.alert('錯誤', '團購建立失敗');
    } finally {
      setLoading(false);
    }








  };





  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>

      <TextInput
        placeholder="* 輸入團購物品名稱"
        placeholderTextColor={getPlaceholderColor("* 輸入團購物品名稱")}
        style={styles.input}
        value={form.item_name}
        onChangeText={text => handleChange('item_name', text)}
      />




      <View style={styles.row}>
        <TextInput
          placeholder="* 物品數量"
          placeholderTextColor={getPlaceholderColor("* 物品數量")}
          style={[styles.input, styles.flex1]}
          keyboardType="numeric"
          value={form.quantity != null ? form.quantity.toString() : ''}
          onChangeText={text => handleChange('quantity', text)}
        />
        <TextInput
          placeholder="* 物品總價"
          placeholderTextColor={getPlaceholderColor("* 物品總價")}
          style={[styles.input, styles.flex1]}
          keyboardType="numeric"
          value={form.total_price.toString()}
          onChangeText={text => handleChange('total_price', text)}
        />
        <TextInput
          placeholder="* 團購單價"
          placeholderTextColor={getPlaceholderColor("* 團購單價")}
          style={[styles.input, styles.flex1]}
          keyboardType="numeric"
          value={form.unit_price.toString()}
          onChangeText={text => handleChange('unit_price', text)}
        />
      </View>




      <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.previewImage} />
        ) : (
          <>
            <Ionicons name="cloud-upload-outline" size={24} color="#666" />
            <Text style={{ color: '#666' }}> 上傳照片 </Text>
          </>
        )}
      </TouchableOpacity>




      <TextInput
        placeholder="輸入商品資訊"
        style={[styles.input, { height: 45 }]}
        multiline
        textAlignVertical="top"
        value={form.information}
        onChangeText={text => handleChange('information', text)}
      />




      <Text style={{ marginBottom: 4, color: '#333' }}>商品類別</Text>
      <TouchableOpacity
        style={[styles.input, { justifyContent: 'center' }]}
        onPress={() => setShowCategoryModal(true)}
      >
        <Text style={{ color: category ? '#000' : '#6c4d3f' }}>
          {category || '* 請選擇商品類別'}
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
            const newHashtags = [...hashtags, trimmed];
            setHashtags(newHashtags);
            setForm(prev => ({ ...prev, hashtag: newHashtags.join(',') }));
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
            const newHashtags = hashtags.filter((_, i) => i !== index);
            setHashtags(newHashtags);
            setForm(prev => ({ ...prev, hashtag: newHashtags.join(',') }));
          }}
          >
            <Text style={styles.hashtagText}>#{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>




      <View style={styles.row}>
        <TextInput
          placeholder="* 分送方式 e.g. 單包裝"
          placeholderTextColor={getPlaceholderColor("* 分送方式 e.g. 單包裝")}
          style={[styles.input, styles.flex1]}
          value={form.share_method}
          onChangeText={text => handleChange('share_method', text)}
        />
        <TextInput
          placeholder="* 分送地點"
          placeholderTextColor={getPlaceholderColor("* 分送地點")}
          style={[styles.input, styles.flex1]}
          value={form.share_location}
          onChangeText={text => handleChange('share_location', text)}
        />
      </View>




      <Text style={{ marginBottom: 4, color: '#333' }}>* 結單方式</Text>
      <View style={styles.radioRow}>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => {
            setClosingMethod('quantity');
            setShowDatePicker(false);
            setForm(prev => ({ ...prev, stop_at_date: null, stop_at_num: form.quantity }));
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
            setForm(prev => ({ ...prev, stop_at_date: form.stop_at_date, stop_at_num: 0 }));
          }}
        >
          <View style={styles.radioCircle}>
            {closingMethod === 'datetime' && <View style={styles.radioDot} />}
          </View>
          <Text style={styles.radioText}>設定截止時間</Text>
        </TouchableOpacity>
      </View>






    {closingMethod === 'datetime' && (
      <View style={styles.dateInputRow}>
        <TextInput
          placeholder="年 (YYYY)"
          style={styles.dateInput}
          keyboardType="numeric"
          value={yearInput}
          onChangeText={text => {
            setYearInput(text);
            handleChange('stop_at_date', `${text}-${monthInput.padStart(2, '0')}-${dayInput.padStart(2, '0')}`);
          }}
        />
        <TextInput
          placeholder="月 (MM)"
          style={styles.dateInput}
          keyboardType="numeric"
          value={monthInput}
          onChangeText={text => {
            setMonthInput(text);
            handleChange('stop_at_date', `${yearInput}-${text.padStart(2, '0')}-${dayInput.padStart(2, '0')}`);
          }}
        />
        <TextInput
          placeholder="日 (DD)"
          style={styles.dateInput}
          keyboardType="numeric"
          value={dayInput}
          onChangeText={text => {
            setDayInput(text);
            handleChange('stop_at_date', `${yearInput}-${monthInput.padStart(2, '0')}-${text.padStart(2, '0')}`);
          }}
        />
      </View>
      )}









      <TextInput
        placeholder="備註欄"
        style={styles.input}
        value={form.comment}
        onChangeText={text => handleChange('comment', text)}
      />
      <TextInput
        placeholder="* 可接受支付方式（例如：現金）"
        placeholderTextColor={getPlaceholderColor("* 可接受支付方式（例如：現金）")}
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




      <Modal visible={showCategoryModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {['生活用品', '生鮮食品', '熟食', '零食點心', '調味料', '其他'].map(option => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  setCategory(option);
                  setForm(prev => ({ ...prev, labels: option }));
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
    backgroundColor: '#fdf7ef',
    padding: 16,
    marginBottom: 40,
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
  dateInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8, // optional if using React Native >= 0.71
    marginBottom:12,
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginRight: 8,
    borderRadius: 4,
    textAlign: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
    resizeMode: 'cover',
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
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


/*
{closingMethod === 'quantity' && (
        <TextInput
          placeholder="設定人數上限"
          style={styles.input}
          keyboardType="numeric"
          value={form.stop_at_num ? form.stop_at_num.toString() : ''}
          onChangeText={text => handleChange('stop_at_num', text)}
        />
    )}
        */















