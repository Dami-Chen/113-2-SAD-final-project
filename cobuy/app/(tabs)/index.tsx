import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  Keyboard,
  Pressable,
  Modal,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useAuth } from '../../contexts/auth-context'; // 請根據你的實際路徑調整

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;
const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
console.log('apiUrl =', apiUrl);

// ---- API function ----
async function fetchTags() {
  const res = await fetch(`${apiUrl}/api/tags`);
  if (!res.ok) throw new Error('Failed to fetch tags');
  return res.json();
}

async function fetchOrders({ search, tag, page = 1, pageSize = 20 }) {
  const url = new URL(`${apiUrl}/api/ordersdetail`);
  if (search) url.searchParams.append('search', search);
  if (tag) url.searchParams.append('tag', tag);
  url.searchParams.append('page', page);
  url.searchParams.append('pageSize', pageSize);

  console.log('fetchOrders URL:', url.toString());

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

async function fetchOrderDetail(orderId) {
  const res = await fetch(`${apiUrl}/api/ordersdetail/${orderId}`);
  if (!res.ok) throw new Error('Failed to fetch detail');
  return res.json();
}

const filters = ['類別', '地點', '學校', '賣場'];

export default function HomeScreen() {
  const router = useRouter();
  // 搜尋、商品、標籤、狀態管理
  const [searchText, setSearchText] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [products, setProducts] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [excludeOrderIds, setExcludeOrderIds] = useState([]);

  // 商品詳細 Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // 數量與留言
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  // 搜尋紀錄 & 輔助
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchRecords, setSearchRecords] = useState([]);
  const scrollRef = useRef(null);
  const [searchWrapperY, setSearchWrapperY] = useState(0);
  const { username } = useAuth(); // 這裡 username 就是目前登入的用戶帳號

  // 取得標籤
  useEffect(() => {
    fetchTags()
      .then(setTags)
      .catch(e => {
        console.error('fetchTags error', e);
        setTags([]);
      });
  }, []);

  // 取得商品列表
  useEffect(() => {
  if (!username) return;
    fetch(`${apiUrl}/api/history_order?username=${username}`)
      .then(res => res.json())
      .then(data => {
        // join 和 host 都過濾掉
        const joined = (data || []).filter(o => o.order_type === 'join').map(o => o.order_id);
        const hosted = (data || []).filter(o => o.order_type === 'host').map(o => o.order_id);
        setExcludeOrderIds([...joined, ...hosted].map(id => String(id))); // 字串化避免型別 bug
      })
      .catch(e => {
        console.error('fetch history_order error', e);
        setExcludeOrderIds([]);
      });
  }, [username]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchOrders({ search: searchText, tag: selectedTag })
      .then(setProducts)
      .catch(e => {
        setError(e.message);
        console.error('fetchOrders error', e);
      })
      .finally(() => setLoading(false));
  }, [searchText, selectedTag]);


  // 點擊商品時打開 Modal 並抓詳細資料
  const handleOpenProduct = (item) => {
    console.log('你點的商品', item);
    setSelectedProductId(item.order_id);
    setModalVisible(true);
    setQuantity(1);
    setMessage('');
  };

  // Modal 內抓詳細資料
  useEffect(() => {
    if (modalVisible && selectedProductId) {
      setDetailLoading(true);
      fetchOrderDetail(selectedProductId)
      .then((data) => {
        console.log('Order Detail:', data); // 加這行
        setSelectedProductDetail(data);
      })
      .finally(() => setDetailLoading(false));
    }
  }, [modalVisible, selectedProductId]);

  const handleJoinOrder = async ({ quantity, message }) => {
    try {
      // Debug: 印出目前關鍵變數
      console.log('apiUrl:', apiUrl);
      console.log('selectedProductId:', selectedProductId);
      console.log('selectedProductDetail:', selectedProductDetail);
      console.log('username:', username, 'quantity:', quantity, 'message:', message);

      // 1. 查詢參與者數量
      const participantsUrl = `${apiUrl}/api/orders/${selectedProductId}`;
      console.log('GET participants URL:', participantsUrl);
      const resParticipants = await fetch(participantsUrl);
      const participantsText = await resParticipants.text();
      console.log('participants API 回應:', participantsText);

      let participants = [];
      try {
        participants = JSON.parse(participantsText);
      } catch (err) {
        console.error('解析 participants 失敗，API 回傳不是 JSON:', participantsText);
        alert('查詢參與者失敗，API 回傳不是 JSON！');
        return;
      }

      const totalJoined = participants.reduce((acc, cur) => acc + Number(cur.quantity), 0);
      const stopAtNum = selectedProductDetail?.stop_at_num;
      console.log('已拼總數:', totalJoined, '最大可拼:', stopAtNum);

      if (stopAtNum != 0 && totalJoined + quantity > stopAtNum) {
        alert(`剩餘可拼單數量只有 ${stopAtNum - totalJoined}，請重新選擇數量`);
        return;
      }

      // 4. 正常送 join API
      const joinUrl = `${apiUrl}/api/orders/${selectedProductId}/join`;
      const postBody = { username, quantity, message };
      console.log('POST join URL:', joinUrl);
      console.log('POST body:', postBody);

      const res = await fetch(joinUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postBody)
      });

      const joinText = await res.text();
      console.log('join API 回應:', joinText);

      let data = {};
      try {
        data = JSON.parse(joinText);
      } catch (err) {
        console.error('join API 回傳不是 JSON:', joinText);
        alert('API 回傳不是 JSON，請檢查路徑與 server 狀態');
        return;
      }

      if (res.ok) {
        Alert.alert(
          '確認信息',
          `成功加入商品【${selectedProductDetail.item_name}】的拼單！`,
          [{ text: '確認' }]);
        setModalVisible(false);

        // 重新刷新商品列表
        fetchOrders({ search: searchText, tag: selectedTag })
          .then(setProducts)
          .catch((err) => setError(err.message));
      } else {
        alert(data.error || '加入拼單失敗');
      }
    } catch (e) {
      alert('加入拼單失敗，請稍後再試');
      console.error('catch error:', e);
    }
  };

  const now = new Date();
  // products 是你的全部商品列表
  const filteredProducts = products.filter((item) => {
    // 1. 排除自己已經參加/自己開的單
    if (excludeOrderIds.includes(String(item.order_id))) return false;

    // 2. 已額滿（如果 stop_at_num !== null && quantity >= stop_at_num
    if (
      item.stop_at_num !== 0 &&
      item.stop_at_num !== undefined &&
      Number(item.joined_count) >= Number(item.stop_at_num)
    ) return false;

    // 3. 已結束（stop_at_date !== null 且 < 現在）
    if (
      item.stop_at_date !== null &&
      item.stop_at_date !== undefined &&
      new Date(item.stop_at_date) < now
    ) return false;

    return true; // 都沒中就顯示
  });

  // Header + 搜尋
  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <Text style={styles.logo}>CoBuy</Text>
        <TouchableOpacity onPress={() => router.push('/profile/info')}>
          <Ionicons name="person-circle-outline" size={28} color="#B38F7D" />
        </TouchableOpacity>
      </View>
      <View
        style={styles.searchWrapper}
        onLayout={e => setSearchWrapperY(e.nativeEvent.layout.y)}
      >
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={{ marginLeft: 12 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="今天想找點什麼呢嘉儀！"
            placeholderTextColor="#999"
            onFocus={() => setIsSearchActive(true)}
            onBlur={() => setIsSearchActive(false)}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={() => {
              if (searchText.trim()) {
                setSearchRecords(prev => [searchText.trim(), ...prev].slice(0, 3));
                setSearchText('');
                setIsSearchActive(true);
                setTimeout(() => scrollRef.current?.scrollTo({ y: searchWrapperY, animated: true }), 100);
              }
            }}
          />
        </View>
        {isSearchActive && (
          <View style={styles.searchHistory}>
            {searchRecords.map((rec, idx) => (
              <TouchableOpacity key={idx}>
                <Text style={styles.searchHistoryItem}>🔍 {rec}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  // 標籤列
  const renderTags = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagRow}>
      {tags.map((t) => (
        <TouchableOpacity
          key={t.tag}
          style={[
            styles.tag,
            selectedTag === t.tag && { backgroundColor: '#B38F7D' }
          ]}
          onPress={() => setSelectedTag(selectedTag === t.tag ? null : t.tag)}
        >
          <Text style={[
            styles.tagText,
            selectedTag === t.tag && { color: '#fff' }
          ]}>#{t.tag}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  // 篩選列
  const renderFilters = () => (
    <View style={styles.filterRow}>
      {filters.map((f) => (
        <TouchableOpacity key={f} style={styles.filterBtn}>
          <Text style={styles.filterText}>{f} ▾</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // 商品卡片
  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleOpenProduct(item)}
    >
      <Text style={styles.cardLabel}>商品</Text>
      {/* 圖片欄位以 image_url 欄為主，沒有的話用預設圖 */}
      <Image
        source={item.image_url ? { uri: item.image_url } : require('../../assets/images/prod1.png')}
        style={styles.cardImage}
        resizeMode="contain"
      />
      <Text style={styles.cardDate}>{item.date || ''}</Text>
      <Text numberOfLines={1}>{item.item_name}</Text>
    </TouchableOpacity>
  );

  // Modal 內容
  const renderModal = () => (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Pressable onPress={() => setModalVisible(false)} style={styles.modalClose}>
            <Text style={styles.modalCloseText}>×</Text>
          </Pressable>
          {detailLoading || !selectedProductDetail ? (
            <ActivityIndicator />
          ) : (
            <>
              <Image
                source={selectedProductDetail.image
                  ? { uri: selectedProductDetail.image }
                  : require('../../assets/images/prod1.png')}
                style={styles.modalImage}
                resizeMode="contain"
              />
              <Text style={styles.modalTitle}>{selectedProductDetail.item_name}</Text>
              <View style={styles.detailBox}>
                <Text>商品資訊：{selectedProductDetail.information}</Text>
                <Text>分送方式：{selectedProductDetail.share_method}</Text>
                <Text>分送地點：{selectedProductDetail.share_location}</Text>
                <Text>結單方式：{selectedProductDetail.stop_at_num != 0
                                ? `數量達到 ${selectedProductDetail.stop_at_num}`
                                : selectedProductDetail.stop_at_date != null
                                  ? `${selectedProductDetail.stop_at_date.split('T')[0]} 截止`
                                  : '無'}</Text>
                <Text>單主的話：{selectedProductDetail.comment}</Text>
              </View>
              <View style={styles.quantityBox}>
                <TouchableOpacity onPress={() => setQuantity((q) => Math.max(1, q - 1))}>
                  <Text>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityNumber}>{quantity}</Text>
                <TouchableOpacity onPress={() => setQuantity((q) => q + 1)}>
                  <Text>+</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.modalInput}
                placeholder="留言給單主"
                value={message}
                onChangeText={setMessage}
              />
              <TouchableOpacity
                style={styles.modalSubmit}
                onPress={() => handleJoinOrder( { quantity, message })}
              >
                <Text style={styles.modalSubmitText}>送出訂單</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => {
        setIsSearchActive(false);
        Keyboard.dismiss();
      }}
    >
      {loading && <ActivityIndicator style={{ marginTop: 40 }} />}
      {error && <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>{error}</Text>}
      <FlatList
        data={filteredProducts}
        // data={products}
        keyExtractor={(item) => String(item.order_id)}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
        contentContainerStyle={{
          paddingBottom: 80,
          paddingHorizontal: 16,
          paddingTop: 48,
          backgroundColor: '#FFF8F0',
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            {renderHeader()}
            {renderTags()}
            {renderFilters()}
          </>
        }
        renderItem={renderProduct}
      />
      {renderModal()}
    </Pressable>
  );
}

// --- StyleSheet 保持不變 ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    paddingHorizontal: 16,
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    color: '#B38F7D',
    fontWeight: 'bold',
  },
  searchWrapper: {
    backgroundColor: '#fff',
    borderRadius: 24,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 10,
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
  },
  searchHistory: {
    padding: 12,
    borderRadius: 8,
  },
  searchHistoryItem: {
    paddingVertical: 8,
    fontSize: 14,
  },
  tagRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
  },
  tagText: {
    color: '#B38F7D',
    fontSize: 12,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterBtn: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterText: {
    color: '#B38F7D',
    fontSize: 12,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
  },
  cardLabel: {
    alignSelf: 'flex-start',
    fontSize: 12,
    color: '#B38F7D',
    marginBottom: 4,
  },
  cardImage: {
    width: CARD_WIDTH - 16,
    height: CARD_WIDTH - 16,
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-end',
  },
  tabBar: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    height: 56,
    backgroundColor: '#FFF',
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  fab: {
    backgroundColor: '#B38F7D',
    width: 56,
    height: 56,
    borderRadius: 28,
    marginTop: -28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFF8F0',
    borderRadius: 12,
    padding: 16,
  },
  modalClose: {
    alignSelf: 'flex-end',
  },
  modalCloseText: {
    fontSize: 24,
    color: '#999',
  },
  modalImage: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    position: 'relative',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityNumber: {
    marginHorizontal: 16,
    fontSize: 16,
  },
  modalInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  modalSubmit: {
    backgroundColor: '#F66',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalSubmitText: {
    color: '#fff',
    fontSize: 16,
  },
});