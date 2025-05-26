// // screens/HomeScreen.tsx
// import React, { useState, useRef, useEffect } from 'react';
// import { useRouter } from 'expo-router';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   Image,
//   StyleSheet,
//   Dimensions,
//   ScrollView,
//   Keyboard,
//   Pressable,
//   Modal,
// } from 'react-native';
// import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

// const { width } = Dimensions.get('window');
// const CARD_WIDTH = (width - 48) / 2; // 16px padding + between
// const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

// // 範例標籤資料
// // const tags = ['食品', '生活用品', 'Costco'];
// async function fetchTags() {
//   const res = await fetch(`${apiUrl}/api/tags`);
//   if (!res.ok) throw new Error('Failed to fetch tags');
//   return res.json();
// }

// // 範例篩選按鈕
// const filters = ['類別', '地點', '學校', '賣場'];

// // 範例商品資料 (請自行改成真實圖片)
// const products = [
//   { id: '1', title: '五月花 衛生紙', image: require('../../assets/images/prod1.png'), date: 'XX/XX' },
//   { id: '2', title: '果醬套組',    image: require('../../assets/images/prod2.png'), date: 'XX/XX' },
//   { id: '3', title: '牛乳餅乾',    image: require('../../assets/images/prod3.png'), date: 'XX/XX' },
//   { id: '4', title: '泡麵大碗裝',  image: require('../../assets/images/prod4.png'), date: 'XX/XX' },
// ];

// async function fetchOrders({ search, tag, page = 1, pageSize = 20 }) {
//   const url = new URL(`${apiUrl}/api/orders`);
//   if (search) url.searchParams.append('search', search);
//   if (tag) url.searchParams.append('tag', tag);
//   url.searchParams.append('page', page);
//   url.searchParams.append('pageSize', pageSize);

//   const res = await fetch(url.toString());
//   if (!res.ok) throw new Error('Failed to fetch orders');
//   return res.json();
// }

// async function fetchOrderDetail(orderId) {
//   const res = await fetch(`${apiUrl}/api/orders/${orderId}`);
//   if (!res.ok) throw new Error('Failed to fetch detail');
//   return res.json();
// }


// export default function HomeScreen() {
//   const router = useRouter();
//   const [isSearchActive, setIsSearchActive] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
//   const [quantity, setQuantity] = useState(1);

//   const [selectedProductId, setSelectedProductId] = useState(null);
//   const [selectedProductDetail, setSelectedProductDetail] = useState(null);

//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // 搜尋文字、標籤、分頁等（看你要不要加）
//   const [searchText, setSearchText] = useState('');
//   const [selectedTag, setSelectedTag] = useState(null);
//   // 分頁可自行加入
//   const [searchRecords, setSearchRecords] = useState<string[]>([]);
//   const scrollRef = useRef<ScrollView>(null);
//   const [searchWrapperY, setSearchWrapperY] = useState(0);

//   // Header + 搜尋區
//   const renderHeader = () => (
//     <View>
//       <View style={styles.header}>
//         <Text style={styles.logo}>西敗</Text>
//         <TouchableOpacity onPress={() => router.push('/profile')}>
//           <Ionicons name="person-circle-outline" size={28} color="#B38F7D" />
//         </TouchableOpacity>
//       </View>
//       <View
//         style={styles.searchWrapper}
//         onLayout={e => setSearchWrapperY(e.nativeEvent.layout.y)}
//       >
//         <View style={styles.searchContainer}>
//           <Ionicons name="search" size={20} color="#999" style={{ marginLeft: 12 }} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="今天想找點什麼呢嘉儀！"
//             placeholderTextColor="#999"
//             onFocus={() => setIsSearchActive(true)}
//             onBlur={() => setIsSearchActive(false)}
//             value={searchText}
//             onChangeText={setSearchText}
//             onSubmitEditing={async () => {
//               if (searchText.trim()) {
//                 setSearchRecords(prev => [searchText.trim(), ...prev].slice(0, 3));

//                 try {
//                   await fetch('https://your-backend-api-endpoint.com/api/search-records', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ keyword: searchText.trim() }),
//                   });
//                 } catch (error) {
//                   console.error('Failed to save search record', error);
//                 }

//                 setSearchText('');
//                 setIsSearchActive(true);
//                 setTimeout(() => scrollRef.current?.scrollTo({ y: searchWrapperY, animated: true }), 100);
//               }
//             }}
//           />
//         </View>
//         {isSearchActive && (
//           <View style={styles.searchHistory}>
//             {searchRecords.map((rec, idx) => (
//               <TouchableOpacity key={idx}>
//                 <Text style={styles.searchHistoryItem}>🔍 {rec}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}
//       </View>
//     </View>
//   );

//   // 標籤列
//   const [tags, setTags] = useState([]);
//   useEffect(() => {
//     fetchTags().then(setTags);
//   }, []);

//   const renderTags = () => (
//     <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagRow}>
//       {tags.map((t) => (
//         <View key={t.tag} style={styles.tag}>
//           <Text style={styles.tagText}>#{t.tag}</Text>
//         </View>
//       ))}
//     </ScrollView>
//   );

//   // 篩選按鈕列
//   const renderFilters = () => (
//     <View style={styles.filterRow}>
//       {filters.map((f) => (
//         <TouchableOpacity key={f} style={styles.filterBtn}>
//           <Text style={styles.filterText}>{f} ▾</Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );

//   // 商品卡片
//   useEffect(() => {
//     setLoading(true);
//     setError(null);
//     fetchOrders({ search: searchText, tag: selectedTag })
//       .then(setProducts)
//       .catch((err) => setError(err.message))
//       .finally(() => setLoading(false));
//   }, [searchText, selectedTag]);

//   const handleOpenProduct = (item) => {
//     setSelectedProductId(item.order_id);
//     setModalVisible(true);
//   };

//   const renderProduct = ({ item }: { item: typeof products[0] }) => (
//     <TouchableOpacity
//       style={styles.card}
//       onPress={() => {
//         setSelectedProduct(item);
//         setModalVisible(true);
//       }}
//     >
//       <Text style={styles.cardLabel}>商品</Text>
//       <Image source={item.image} style={styles.cardImage} resizeMode="contain" />
//       <Text style={styles.cardDate}>{item.date}</Text>
//     </TouchableOpacity>
//   );

//   const renderProduct = ({ item }) => (
//     <TouchableOpacity
//       style={styles.card}
//       onPress={() => handleOpenProduct(item)}
//     >
//       <Text style={styles.cardLabel}>商品</Text>
//       <Image source={{ item.image}} style={styles.cardImage} resizeMode="contain" />
//       <Text style={styles.cardDate}>{item.date}</Text>
//       <Text>{item.item_name}</Text>
//     </TouchableOpacity>
//   );

//   useEffect(() => {
//     if (modalVisible && selectedProductId) {
//       fetchOrderDetail(selectedProductId).then(setSelectedProductDetail);
//     }
//   }, [modalVisible, selectedProductId]);
//   // 底部 Tab Bar (自訂範例)
// /*  const renderTabBar = () => (
//     <View style={styles.tabBar}>
//       <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/')}>
//         <Ionicons name="home-outline" size={24} color="#B38F7D" />
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/history_order')}>
//         <MaterialCommunityIcons name="clipboard-list-outline" size={24} color="#B38F7D" />
//       </TouchableOpacity>
//       <TouchableOpacity style={[styles.tabItem, styles.fab]} onPress={() => router.push('/create_order')}>
//         <Feather name="plus" size={24} color="#fff" />
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/')}>
//         <Ionicons name="chatbubble-outline" size={24} color="#B38F7D" />
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/notification')}>
//         <Ionicons name="notifications-outline" size={24} color="#B38F7D" />
//       </TouchableOpacity>
//     </View>
//   ); */

//   return (
//     <Pressable
//       style={{ flex: 1 }}
//       onPress={() => {
//         setIsSearchActive(false);
//         Keyboard.dismiss();
//       }}
//     >
//       <FlatList
//         data={products}
//         keyExtractor={(item) => item.id}
//         numColumns={2}
//         columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
//         contentContainerStyle={{
//           paddingBottom: 80,
//           paddingHorizontal: 16,
//           paddingTop: 48,
//           backgroundColor: '#FFF8F0',
//           flexGrow: 1,
//         }}
//         keyboardShouldPersistTaps="handled"
//         ListHeaderComponent={
//           <>
//             {renderHeader()}
//             {renderTags()}
//             {renderFilters()}
//           </>
//         }
//         renderItem={renderProduct}
//         ListFooterComponent={
//           selectedProduct && (
//             <Modal
//               visible={modalVisible}
//               animationType="slide"
//               transparent
//               onRequestClose={() => setModalVisible(false)}
//             >
//               <View style={styles.modalOverlay}>
//                 <View style={styles.modalContent}>
//                   <Pressable onPress={() => setModalVisible(false)} style={styles.modalClose}>
//                     <Text style={styles.modalCloseText}>×</Text>
//                   </Pressable>
//                   <Image
//                     source={selectedProduct.image}
//                     style={styles.modalImage}
//                     resizeMode="contain"
//                   />
//                   <Text style={styles.modalTitle}>{selectedProduct.title}</Text>
//                   <View style={styles.detailBox}>
//                     <Text>商品資訊：...</Text>
//                     <Text>分送方式：...</Text>
//                     <Text>分送地點：...</Text>
//                     <Text>結單方式：...</Text>
//                     <Text>單主的話：...</Text>
//                   </View>
//                   <View style={styles.quantityBox}>
//                     <TouchableOpacity onPress={() => setQuantity((q) => Math.max(1, q - 1))}>
//                       <Text>-</Text>
//                     </TouchableOpacity>
//                     <Text style={styles.quantityNumber}>{quantity}</Text>
//                     <TouchableOpacity onPress={() => setQuantity((q) => q + 1)}>
//                       <Text>+</Text>
//                     </TouchableOpacity>
//                   </View>
//                   <TextInput style={styles.modalInput} placeholder="留言給單主" />
//                   <TouchableOpacity style={styles.modalSubmit}>
//                     <Text style={styles.modalSubmitText}>送出訂單</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </Modal>
//           )
//         }
//       />
//     </Pressable>
//   );
// }

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
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;
const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

// ---- API function ----
async function fetchTags() {
  const res = await fetch(`${apiUrl}/api/tags`);
  if (!res.ok) throw new Error('Failed to fetch tags');
  return res.json();
}
async function fetchOrders({ search, tag, page = 1, pageSize = 20 }) {
  const url = new URL(`${apiUrl}/api/orders`);
  if (search) url.searchParams.append('search', search);
  if (tag) url.searchParams.append('tag', tag);
  url.searchParams.append('page', page);
  url.searchParams.append('pageSize', pageSize);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}
async function fetchOrderDetail(orderId) {
  const res = await fetch(`${apiUrl}/api/orders/${orderId}`);
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

  // 取得標籤
  useEffect(() => {
    fetchTags().then(setTags).catch(() => setTags([]));
  }, []);

  // 取得商品列表
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchOrders({ search: searchText, tag: selectedTag })
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchText, selectedTag]);

  // 點擊商品時打開 Modal 並抓詳細資料
  const handleOpenProduct = (item) => {
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
        .then(setSelectedProductDetail)
        .finally(() => setDetailLoading(false));
    }
  }, [modalVisible, selectedProductId]);

  // Header + 搜尋
  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <Text style={styles.logo}>西敗</Text>
        <TouchableOpacity onPress={() => router.push('/profile')}>
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
                <Text>結單方式：{selectedProductDetail.stop_at_date}</Text>
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
                // TODO: 這裡可以串 order join API
                onPress={() => alert('送出訂單功能可進一步串接 API')}
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
        data={products}
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