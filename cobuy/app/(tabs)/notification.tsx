import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../contexts/auth-context';

const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

const Notification = () => {
  const [selectedTab, setSelectedTab] = useState<'unread' | 'all'>('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const [allMessages, setAllMessages] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const { username } = useAuth();

  // 彈窗 state
  const [orderDetailVisible, setOrderDetailVisible] = useState(false);
  const [orderDetailData, setOrderDetailData] = useState(null);
  const [orderDetailLoading, setOrderDetailLoading] = useState(false);

  // 記錄已展開（opened）訊息 notification_id
  const [openedSet, setOpenedSet] = useState(new Set());

  // 取得通知列表
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch(`${apiUrl}/api/notifications?username=${username}`);
        const data = await res.json();
        setAllMessages(data);
        setUnreadMessages(data.filter(n => !n.is_read));
      } catch (err) {
        setAllMessages([]);
        setUnreadMessages([]);
      }
    }
    fetchNotifications();
  }, [username]);

  // 設為已讀
  async function markAsRead(id, username) {
    try {
      await fetch(`${apiUrl}/api/notifications/${id}/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
    } catch {}
  }

  // 批次標記已讀（只針對展開過的）
  useEffect(() => {
    if (selectedTab !== 'unread' && openedSet.size > 0) {
      const openedUnread = unreadMessages.filter(msg => openedSet.has(msg.notification_id));
      if (openedUnread.length > 0) {
        openedUnread.forEach(msg => {
          markAsRead(msg.notification_id, username);
        });
        setAllMessages(prev =>
          prev.map(m =>
            openedSet.has(m.notification_id) ? { ...m, is_read: true } : m
          )
        );
        setUnreadMessages(prev =>
          prev.filter(m => !openedSet.has(m.notification_id))
        );
        setOpenedSet(new Set());
      }
    }
  }, [selectedTab]);

  // 取得訂單詳細
  async function fetchOrderDetail(orderId) {
    setOrderDetailLoading(true);
    setOrderDetailData(null);
    try {
      const res = await fetch(`${apiUrl}/api/ordersdetail/${orderId}`);
      if (!res.ok) throw new Error('Failed to fetch detail');
      const data = await res.json();
      setOrderDetailData(data);
      setOrderDetailVisible(true);
    } catch (err) {
      setOrderDetailData(null);
      setOrderDetailVisible(true);
    }
    setOrderDetailLoading(false);
  }

  const renderMessages = selectedTab === 'unread' ? unreadMessages : allMessages;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={[
            styles.tabButton,
            selectedTab === 'unread' && styles.activeTab,
          ]}
          onPress={() => setSelectedTab('unread')}
        >
          <Text style={styles.tabText}>未讀訊息</Text>
        </Pressable>
        <Pressable
          style={[
            styles.tabButton,
            selectedTab === 'all' && styles.activeTab,
          ]}
          onPress={() => setSelectedTab('all')}
        >
          <Text style={styles.tabText}>全部訊息</Text>
        </Pressable>
      </View>

      <ScrollView style={{ marginTop: 20 }}>
        {renderMessages.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>暫無通知</Text>
        ) : (
          renderMessages.map((msg, index) => (
            <TouchableOpacity
              key={msg.notification_id || index}
              onPress={() => {
                setExpandedIndex(index === expandedIndex ? null : index);
                // 展開訊息時記錄 notification_id
                if (index !== expandedIndex) {
                  setOpenedSet(prev => new Set(prev).add(msg.notification_id));
                }
              }}
            >
              <View style={styles.messageBox}>
                <Text>{msg.title}</Text>
                <Text style={{ color: '#666', fontSize: 13, marginVertical: 4 }}>{msg.message}</Text>
                <Text style={{ color: '#bbb', fontSize: 11 }}>{msg.created_at?.slice(0, 16)}</Text>
                {expandedIndex === index && (
                  <View style={styles.expandedCard}>
                    {msg.order_id && <Text style={styles.expandedText}>訂單編號：{msg.order_id}</Text>}
                    <Pressable
                      style={styles.orderButton}
                      onPress={() => fetchOrderDetail(msg.order_id)}
                    >
                      <Text style={styles.orderButtonText}>查看訂單</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* === 訂單詳細彈窗 === */}
      <Modal
        visible={orderDetailVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setOrderDetailVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: '#FFF',
            borderRadius: 14,
            padding: 20,
            width: '85%',
          }}>
            <Pressable style={{ alignSelf: 'flex-end' }} onPress={() => setOrderDetailVisible(false)}>
              <Text style={{ fontSize: 22, color: '#888' }}>×</Text>
            </Pressable>
            {orderDetailLoading ? (
              <Text style={{ textAlign: 'center', marginVertical: 30 }}>載入中...</Text>
            ) : orderDetailData ? (
              <>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                  {orderDetailData.item_name}
                </Text>
                <Text>訂單編號：{orderDetailData.order_id}</Text>
                <Text>商品資訊：{orderDetailData.information || '無'}</Text>
                <Text>分送方式：{orderDetailData.share_method || '無'}</Text>
                <Text>分送地點：{orderDetailData.share_location || '無'}</Text>
                <Text>
                  結單方式：{
                    orderDetailData.stop_at_num != 0
                      ? `數量達到 ${orderDetailData.stop_at_num}`
                      : orderDetailData.stop_at_date != null
                        ? `${orderDetailData.stop_at_date} 截止`
                        : '無'
                  }
                </Text>
                <Text>單主的話：{orderDetailData.comment || '無'}</Text>
              </>
            ) : (
              <Text style={{ color: 'red', textAlign: 'center' }}>查無此訂單</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: '#eee',
  },
  activeTab: {
    backgroundColor: '#fff',
    elevation: 2,
  },
  tabText: {
    fontWeight: '600',
  },
  messageBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  expandedCard: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  expandedText: {
    marginBottom: 6,
    color: '#444',
  },
  orderButton: {
    backgroundColor: '#FF7A7A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  orderButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Notification;
