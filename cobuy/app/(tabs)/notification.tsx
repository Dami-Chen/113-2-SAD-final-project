import { View, Text, StyleSheet, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

const Notification = () => {
  const [selectedTab, setSelectedTab] = useState<'unread' | 'all'>('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const unreadMessages = [
    '訂單號 xxxxxxx：單主已採購完成，陳嘉儀可以準備拿到商品囉！',
    '訂單號 xxxxxxx：單主已完成採購，陳嘉儀記得來拿你的寶貝囉！',
    '訂單號 xxxxxxx：你參加的團購已經到貨～準備好迎接美味吧 😋',
  ];

  const allMessages = [
    ...unreadMessages,
    '訂單號 xxxxxxx：商品已採購完成，陳嘉儀快來認領你的份啦！',
    '訂單號 xxxxxxx：單主說商品已搞定，陳嘉儀可以安排時間來取貨囉！',
    '訂單號 xxxxxxx：你的團購好物到啦！別忘了找單主領取～',
    '訂單號 xxxxxxx：商品準備好了～陳嘉儀趕快出動拿貨吧',
  ];

  const renderMessages = selectedTab === 'unread' ? unreadMessages : allMessages;

  return (
    <View style={styles.container} className="flex-1 bg-primary">
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
        {renderMessages.map((msg, index) => (
          <TouchableOpacity key={index} onPress={() => setExpandedIndex(index === expandedIndex ? null : index)}>
            <View style={styles.messageBox}>
              <Text>{msg}</Text>
              {expandedIndex === index && (
                <View style={styles.expandedCard}>
                  <Text style={styles.expandedText}>分送地點：女九舍</Text>
                  <Text style={styles.expandedText}>分送時間：詢問單主方便的時間</Text>
                  <Text style={styles.expandedText}>單主的話：哈哈</Text>
                  <Pressable style={styles.orderButton}>
                    <Text style={styles.orderButtonText}>查看訂單</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
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