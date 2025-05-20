// screens/HomeScreen.tsx
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
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 16px padding + between

// 範例標籤資料
const tags = ['食品', '生活用品', 'Costco'];
// 範例篩選按鈕
const filters = ['類別', '地點', '學校', '賣場'];
// 範例商品資料 (請自行改成真實圖片)
const products = [
  { id: '1', title: '五月花 衛生紙', image: require('../../assets/images/prod1.png'), date: 'XX/XX' },
  { id: '2', title: '果醬套組',    image: require('../../assets/images/prod2.png'), date: 'XX/XX' },
  { id: '3', title: '牛乳餅乾',    image: require('../../assets/images/prod3.png'), date: 'XX/XX' },
  { id: '4', title: '泡麵大碗裝',  image: require('../../assets/images/prod4.png'), date: 'XX/XX' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [quantity, setQuantity] = useState(1);

  const [searchText, setSearchText] = useState('');
  const [searchRecords, setSearchRecords] = useState<string[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const [searchWrapperY, setSearchWrapperY] = useState(0);

  // Header + 搜尋區
  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <Text style={styles.logo}>西敗</Text>
        <TouchableOpacity>
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
                setSearchRecords(prev => [searchText.trim(), ...prev].slice(0,3));
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
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.tagRowContainer}
      contentContainerStyle={styles.tagRowContent}
    >
      {tags.map((t) => (
        <View key={t} style={styles.tag}>
          <Text style={styles.tagText}>#{t}</Text>
        </View>
      ))}
    </ScrollView>
  );

  // 篩選按鈕列
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
  const renderProduct = ({ item }: { item: typeof products[0] }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedProduct(item);
        setModalVisible(true);
      }}
    >
      <Text style={styles.cardLabel}>商品</Text>
      <Image source={item.image} style={styles.cardImage} resizeMode="contain" />
      <Text style={styles.cardDate}>{item.date}</Text>
    </TouchableOpacity>
  );

  // 底部 Tab Bar (自訂範例)
/*  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/')}>
        <Ionicons name="home-outline" size={24} color="#B38F7D" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/history_order')}>
        <MaterialCommunityIcons name="clipboard-list-outline" size={24} color="#B38F7D" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.tabItem, styles.fab]} onPress={() => router.push('/create_order')}>
        <Feather name="plus" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/')}>
        <Ionicons name="chatbubble-outline" size={24} color="#B38F7D" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/notification')}>
        <Ionicons name="notifications-outline" size={24} color="#B38F7D" />
      </TouchableOpacity>
    </View>
  ); */

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => {
        setIsSearchActive(false);
        Keyboard.dismiss();
      }}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {renderHeader()}
        {renderTags()}
        {renderFilters()}

        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={renderProduct}
        />

        {selectedProduct && (
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Pressable onPress={() => setModalVisible(false)}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                  </Pressable>
                  <Text style={styles.modalHeaderText}>XXX / 每份</Text>
                  {/* placeholder for spacing */}
                  <View style={{ width: 24 }} />
                </View>
                <View style={styles.modalDivider} />
                <Image source={selectedProduct.image} style={styles.modalImage} resizeMode="contain" />
                <Text style={styles.modalTitle}>{selectedProduct.title}</Text>
                <View style={styles.detailBox}>
                  <Text>商品資訊：...</Text>
                  <Text>分送方式：...</Text>
                  <Text>分送地點：...</Text>
                  <Text>結單方式：...</Text>
                  <Text>單主的話：...</Text>
                </View>
                <View style={styles.quantityBox}>
                  <TouchableOpacity onPress={() => setQuantity(q => Math.max(1, q - 1))}>
                    <Text>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityNumber}>{quantity}</Text>
                  <TouchableOpacity onPress={() => setQuantity(q => q + 1)}>
                    <Text>+</Text>
                  </TouchableOpacity>
                </View>
                <TextInput style={styles.modalInput} placeholder="留言給單主" />
                <TouchableOpacity style={styles.modalSubmit}><Text style={styles.modalSubmitText}>送出訂單</Text></TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
    </Pressable>
  );
}

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
    height: 25,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 14,
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
  tagRowContainer: {
    marginBottom: 4,
  },
  tagRowContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    marginBottom: 12,
    alignItems: 'center',
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
    width: '80%',          // reduce width so there's padding on sides
    height: 200,           // keep height
    alignSelf: 'center',   // center horizontally
    marginTop: 16,         // add top margin below divider
    marginBottom: 16,      // maintain bottom margin before title
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
  modalHeader: {
    width: '109.8%',
    backgroundColor: '#E0D0C0',
    padding: 12,
    marginTop: -16,       // extend up to outer edge
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: -16, // extend sideways to flush outer edges
  },
  modalHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  modalDivider: {
    height: 4,
    backgroundColor: '#B38F7D',
    marginHorizontal: -16,
  },
});