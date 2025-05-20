import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const Notification = () => {
  const [activeTab, setActiveTab] = useState<'unread' | 'all'>('unread');

  const notifications = [
    { id: '1', text: '訂單號 xxxxxxx：\n單主已採購完成，陳嘉儀可以準備拿到商品囉！', read: false },
    { id: '2', text: '訂單號 xxxxxxx：\n單主已完成採購，陳嘉儀記得來拿你的寶貝囉！', read: false },
    { id: '3', text: '訂單號 xxxxxxx：\n你參加的團購已經到貨～準備好迎接美味吧 😉', read: true },
    // ...etc
  ];

  const displayed = activeTab === 'all' ? notifications : notifications.filter(n => !n.read);

  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab==='unread' && styles.tabBtnActive]}
          onPress={() => setActiveTab('unread')}
        >
          <Text style={[styles.tabText, activeTab==='unread' && styles.tabTextActive]}>未讀訊息</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab==='all' && styles.tabBtnActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab==='all' && styles.tabTextActive]}>全部訊息</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{marginTop:12}}>
        {displayed.map(n => (
          <View key={n.id} style={styles.card}>
            <Text style={styles.cardText}>{n.text}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      padding: 16,          
    },
    title: {
      marginBottom: 12,    
      fontSize: 18,
      fontWeight: '600',
    },
    tabRow: { flexDirection:'row', justifyContent:'center', marginBottom:12 },
    tabBtn: {
      backgroundColor:'#FFF', paddingVertical:6, paddingHorizontal:16,
      borderRadius:16, marginHorizontal:8,
    },
    tabBtnActive: { backgroundColor:'#FFF8F0', },
    tabText: { color:'#AAA', fontSize:14 },
    tabTextActive: { color:'#333', fontWeight:'600' },
    card: {
      backgroundColor:'#FFF', borderRadius:8, padding:12, marginBottom:12,
    },
    cardText: { color:'#333', lineHeight:20 },
})

export default Notification