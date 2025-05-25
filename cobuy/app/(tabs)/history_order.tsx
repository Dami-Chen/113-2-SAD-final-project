import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const HistoryOrder = () => {
  const router = useRouter();
  const { tab } = useLocalSearchParams();
  const initialTab = tab === 'join' ? 'join' : 'open';
  const [activeTab, setActiveTab] = useState<'open' | 'join'>(initialTab);

  const openOrders = [
    {
      id: '1',
      name: '團購物品 A',
      max: 5,
      current: 3,
      unitPrice: 100,
      description: 'A 商品說明',
      deliveryMethod: '統一配送',
      deliveryPlace: '台北車站',
      closingMethodLabel: '滿 5 個',
      closingMethod: 'quantity',
      createdAt: new Date('2024-05-25T00:00:00'),
      deadline: new Date('2024-06-01T00:00:00'),
    },
    {
      id: '2',
      name: '團購物品 B',
      max: 4,
      current: 2,
      unitPrice: 80,
      description: 'B 商品說明，口味香濃順口',
      deliveryMethod: '分開配送',
      deliveryPlace: '公館捷運站',
      closingMethodLabel: '滿 4 個',
      closingMethod: 'quantity',
      createdAt: new Date('2024-05-26T12:00:00'),
      deadline: new Date('2024-06-03T00:00:00'),
    },
  ];

  const joinOrders = [
    {
      id: '10',
      name: '團購物品 X',
      max: 6,
      current: 1,
      unitPrice: 150,
      description: 'X 商品是一款熱銷甜點',
      deliveryMethod: '到店自取',
      deliveryPlace: '南港車站',
      closingMethodLabel: '時間截止',
      closingMethod: 'datetime',
      createdAt: new Date('2024-05-20T10:00:00'),
      deadline: new Date('2024-05-28T23:59:59'),
    },
    {
      id: '11',
      name: '團購物品 Y',
      max: 4,
      current: 4,
      unitPrice: 120,
      description: 'Y 商品是一款限量文具組',
      deliveryMethod: '統一包裝',
      deliveryPlace: '市政府站',
      closingMethodLabel: '滿額',
      closingMethod: 'quantity',
      createdAt: new Date('2024-05-18T09:30:00'),
      deadline: new Date('2024-06-05T00:00:00'),
    },
  ];


  const renderOrderCard = (order, isJoin = false) => (
    <TouchableOpacity
      key={order.id}
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: isJoin ? '/(stack)/join_order_detail' : '/(stack)/open_order_detail',
          params: {
            data: JSON.stringify(order),
          },
        })
      }

    >
      <View style={styles.cardTextArea}>
        <Text style={styles.cardTitle}>{order.name}</Text>
        <Text style={styles.cardSub}>目前拼單數量：{order.current}/{order.max}</Text>
        <Text style={styles.cardSub}>結單方式：{order.end}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, {
            width: `${Math.min(order.current / order.max, 1) * 100}%`,
          }]} />
        </View>

      </View>
      <View style={styles.cardImageArea}>
        <View style={styles.imageBox}>
          {/* 可放圖片 */}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setActiveTab('open')} style={styles.tabButton}>
          <Text style={[styles.tabText, activeTab === 'open' && styles.tabTextActive]}>開單</Text>
          {activeTab === 'open' && <View style={styles.underline} />}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('join')} style={styles.tabButton}>
          <Text style={[styles.tabText, activeTab === 'join' && styles.tabTextActive]}>拼單</Text>
          {activeTab === 'join' && <View style={styles.underline} />}
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {(activeTab === 'open' ? openOrders : joinOrders).map(order =>
          renderOrderCard(order, activeTab === 'join')
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdf7ef', paddingTop: 40 },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabButton: { flex: 1, alignItems: 'center', paddingBottom: 8 },
  tabText: { fontSize: 16, color: '#a58b7b' },
  tabTextActive: { color: '#6c4d3f', fontWeight: '600' },
  underline: {
    marginTop: 4,
    height: 2,
    width: '100%',
    backgroundColor: '#6c4d3f',
    borderRadius: 1,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff6f3',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardTextArea: { flex: 1 },
  cardTitle: { color: '#6c4d3f', fontSize: 16, fontWeight: '600', marginBottom: 6 },
  cardSub: { color: '#666', fontSize: 14 },
  progressBar: {
    marginTop: 8,
    height: 8,
    backgroundColor: '#e9d8c7',
    borderRadius: 999,
  },
  cardImageArea: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  imageBox: {
    backgroundColor: '#efe3d6',
    borderRadius: 12,
    padding: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#c59b86',
    borderRadius: 999,
  },

});

export default HistoryOrder;
