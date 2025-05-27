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
import * as ImagePicker from 'expo-image-picker';
import OrderDetail from '../(stack)/open_order_detail';
export default function HistoryOrder(){
  const router = useRouter();
  const { historyOrder, username, getParticipantByOrder, openOrderDetail, openJoinDetail} = useAuth();
  const { tab } = useLocalSearchParams();
  const initialTab = tab === 'join' ? 'join' : 'open';
  const [activeTab, setActiveTab] = useState<'open' | 'join'>(initialTab);
  const [openOrders, setOpenOrders] = useState<OrderFormType[]>([]);
  const [joinOrders, setJoinOrders] = useState<OrderFormType[]>([]);
  const [joinedCounts, setJoinedCounts] = useState<{ [key: string]: number }>({});  
  const [quantityCounts, setQuantity] = useState<{ [key: string]: number }>({});  
  const [loading, setLoading] = useState<boolean>(false);
  const [avatarUri, setAvatarUri] = useState(null);


  const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
 
      if (!result.canceled) {
        setAvatarUri(null);
        // result.assets[0].uri
      }
    };


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


  useEffect(() => {
    const orders = activeTab === 'open' ? openOrders : joinOrders;


    const fetchJoinedCounts = async () => {
      const newCounts: { [key: string]: number } = {};
      const newQuantity: { [key: string]: number } = {};


      await Promise.all(
        orders.map(async (order) => {
          try {
            const participants = await getParticipantByOrder(order.order_id) as unknown as JoinOrderType[];
            const orderDetail = await openJoinDetail(order.order_id) as unknown as OrderFormType[];
            // console.log('🔍 getParticipantByOrder response 衛生紙', participants);
            const totalJoined = participants.reduce(
              (acc: number, cur: { quantity: number }) => acc + Number(cur.quantity),
              0
            );
            newCounts[order.order_id] = totalJoined;
            newQuantity[order.order_id] = Number(orderDetail[0].quantity) || 0; // 確保 quantity 有值


            console.log(`取得參與者數量 ${order.order_id}:`, totalJoined);
            //totalQuantity = Number(orderDetail[0].quantity);
            // console.log(`取得總數量 ${orderDetail[0].quantity}`);
          } catch (err) {
            console.error(`取得參與者失敗：${order.order_id}`, err);
            newCounts[order.order_id] = 0;
          }
        })
      );


      setJoinedCounts(newCounts);
      setQuantity(newQuantity);
    };


    if ((activeTab === 'open' && openOrders.length > 0) || (activeTab === 'join' && joinOrders.length > 0)) {
      fetchJoinedCounts();
    }
  }, [activeTab, openOrders, joinOrders]);


 
  const renderOrderCard = (order: OrderFormType, isJoin = false) => {
    const totalJoined = joinedCounts[order.order_id] || 0;
    const totalQuantity = quantityCounts[order.order_id] || 0; // 確保 quantity 有值
    return(
    <TouchableOpacity
      key={order.order_id}
      style={styles.card}
      onPress={() =>
        router.push(`/(stack)/${isJoin ? 'join_order_detail' : 'open_order_detail'}?id=${order.order_id}`)
      }


    >
      <View style={styles.cardTextArea}>
        <Text style={styles.cardTitle}>{order.item_name}</Text>
        <Text style={styles.cardSub}>目前拼單數量：{totalJoined}/{totalQuantity}</Text>
        <Text style={styles.cardSub}>
        結單方式：
        {typeof order.stop_at_num === 'number' && order.stop_at_num !== 0
          ? `滿 ${totalQuantity} 個`
          : typeof order.stop_at_date === 'string'
            ?  `${new Date(order.stop_at_date).toISOString().split('T')[0]}前`
            : '未設定'}
      </Text>






        <View style={styles.progressBar} >
         <View style={[styles.progressFill, {
            width: `${Math.min(Number(totalJoined) / Number(totalQuantity), 1) * 100}%`,
          }]} />
         </View>
     
     
      </View>
     


    </TouchableOpacity>
  );
};


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
  noImageText: {
  textAlign: 'center',
  color: '#888',
  fontSize: 14,
  padding: 10,
},
 avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
    resizeMode: 'cover',
  },
});


/*
<View style={styles.cardImageArea}>
        <View style={styles.imageBox}>
          {order.imageUrl ? (
            <Image
              source={: require(order.imageUrl )}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.noImageText}>no image</Text>
          )}
        </View>
      </View>
      */





