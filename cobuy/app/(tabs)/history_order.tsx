import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth, OrderFormType, JoinOrderType } from '../../contexts/auth-context';  // Adjust path as needed
import axios from 'axios';

export default function HistoryOrder(){
  const router = useRouter();
  const { historyOrder, username} = useAuth();
  const { tab } = useLocalSearchParams();
  const initialTab = tab === 'join' ? 'join' : 'open';
  const [activeTab, setActiveTab] = useState<'open' | 'join'>(initialTab);
  const [openOrders, setOpenOrders] = useState<OrderFormType[]>([]);
  const [joinOrders, setJoinOrders] = useState<OrderFormType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
  const loadHistory = async () => {
    // setLoading(true);
    // console.log('username:', username);
    try {
      const data = await historyOrder(username); // <-- pass username
      setOpenOrders(data.openOrders);
      setJoinOrders(data.joinOrders);
    } catch (err: any) {
      alert(err.message || '查詢失敗');
    } finally {
      setLoading(false);
    }
  };

  
  loadHistory();
  }, [username]);

  

  const renderOrderCard = (order: OrderFormType, isJoin = false) => (
    <TouchableOpacity

      key={order.order_id}
      style={styles.card}
      onPress={() =>
        
        router.push(`/(stack)/${isJoin ? 'join_order_detail' : 'open_order_detail'}?id=${order.order_id}`)
      }
    >
      <View style={styles.cardTextArea}>
    
        <Text style={styles.cardTitle}>{order.item_name}</Text>
        <Text style={styles.cardSub}>目前拼單數量：{order.quantity}/{order.stop_at_num}</Text>
        <Text style={styles.cardSub}>結單方式：{order.stop_at_num}</Text>
        <View style={styles.progressBar} >
         <View style={[styles.progressFill, {
            width: `${Math.min(Number(order.quantity) / Number(order.stop_at_num), 1) * 100}%`,
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