import { View, Text, StyleSheet, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/auth-context';

const { username } = useAuth(); // user 物件內有 username

// const Notification = () => {
//   const [selectedTab, setSelectedTab] = useState<'unread' | 'all'>('all');
//   const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

//   const unreadMessages = [
//     '訂單號 xxxxxxx：單主已採購完成，陳嘉儀可以準備拿到商品囉！',
//     '訂單號 xxxxxxx：單主已完成採購，陳嘉儀記得來拿你的寶貝囉！',
//     '訂單號 xxxxxxx：你參加的團購已經到貨～準備好迎接美味吧 😋',
//   ];

//   const allMessages = [
//     ...unreadMessages,
//     '訂單號 xxxxxxx：商品已採購完成，陳嘉儀快來認領你的份啦！',
//     '訂單號 xxxxxxx：單主說商品已搞定，陳嘉儀可以安排時間來取貨囉！',
//     '訂單號 xxxxxxx：你的團購好物到啦！別忘了找單主領取～',
//     '訂單號 xxxxxxx：商品準備好了～陳嘉儀趕快出動拿貨吧',
//   ];

//   const renderMessages = selectedTab === 'unread' ? unreadMessages : allMessages;

//   return (
//     <View style={styles.container} className="flex-1 bg-primary">
//       <View style={styles.header}>
//         <Pressable
//           style={[
//             styles.tabButton,
//             selectedTab === 'unread' && styles.activeTab,
//           ]}
//           onPress={() => setSelectedTab('unread')}
//         >
//           <Text style={styles.tabText}>未讀訊息</Text>
//         </Pressable>
//         <Pressable
//           style={[
//             styles.tabButton,
//             selectedTab === 'all' && styles.activeTab,
//           ]}
//           onPress={() => setSelectedTab('all')}
//         >
//           <Text style={styles.tabText}>全部訊息</Text>
//         </Pressable>
//       </View>

//       <ScrollView style={{ marginTop: 20 }}>
//         {renderMessages.map((msg, index) => (
//           <TouchableOpacity key={index} onPress={() => setExpandedIndex(index === expandedIndex ? null : index)}>
//             <View style={styles.messageBox}>
//               <Text>{msg}</Text>
//               {expandedIndex === index && (
//                 <View style={styles.expandedCard}>
//                   <Text style={styles.expandedText}>分送地點：女九舍</Text>
//                   <Text style={styles.expandedText}>分送時間：詢問單主方便的時間</Text>
//                   <Text style={styles.expandedText}>單主的話：哈哈</Text>
//                   <Pressable style={styles.orderButton}>
//                     <Text style={styles.orderButtonText}>查看訂單</Text>
//                   </Pressable>
//                 </View>
//               )}
//             </View>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

const Notification = () => {
  const [selectedTab, setSelectedTab] = useState<'unread' | 'all'>('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const [allMessages, setAllMessages] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);

  // 取得通知列表
  useEffect(() => {
    async function fetchNotifications() {
      try {
        // 這裡帶上 jwt token，如果你的 API 有登入驗證的話
        // const res = await fetch(`${apiUrl}/api/notifications`, {
        //   headers: {
        //     // Authorization: `Bearer ${token}`, // 如需 JWT token
        //   }
        // });
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
  }, []);

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
              onPress={() => setExpandedIndex(index === expandedIndex ? null : index)}
            >
              <View style={styles.messageBox}>
                <Text>{msg.title}</Text>
                <Text style={{ color: '#666', fontSize: 13, marginVertical: 4 }}>{msg.message}</Text>
                <Text style={{ color: '#bbb', fontSize: 11 }}>{msg.created_at?.slice(0,16)}</Text>
                {expandedIndex === index && (
                  <View style={styles.expandedCard}>
                    {msg.order_id && <Text style={styles.expandedText}>訂單編號：{msg.order_id}</Text>}
                    {/* 可以加其他細節，ex: 分送地點、單主的話等 */}
                    <Pressable style={styles.orderButton}>
                      <Text style={styles.orderButtonText}>查看訂單</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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