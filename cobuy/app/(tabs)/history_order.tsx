import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const HistoryOrder = () => {
  const [activeTab, setActiveTab] = useState<'open' | 'join'>('open');

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.headerText}>我的團購</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => setActiveTab('open')}
          style={styles.tabButton}
        >
          <Text style={[styles.tabText, activeTab === 'open' && styles.tabTextActive]}>
            開單
          </Text>
          {activeTab === 'open' && <View style={styles.underline} />}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('join')}
          style={styles.tabButton}
        >
          <Text style={[styles.tabText, activeTab === 'join' && styles.tabTextActive]}>
            拼單
          </Text>
          {activeTab === 'join' && <View style={styles.underline} />}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={{ flex: 1 }}>
        {activeTab === 'open' ? (
          <Text style={styles.contentText}>這是「開單」的內容</Text>
        ) : (
          <Text style={styles.contentText}>這是「拼單」的內容</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf7ef',
    paddingTop: 40,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6c4d3f',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 8,
  },
  tabText: {
    fontSize: 16,
    color: '#a58b7b',
  },
  tabTextActive: {
    color: '#6c4d3f',
    fontWeight: '600',
  },
  underline: {
    marginTop: 4,
    height: 2,
    width: '100%',
    backgroundColor: '#6c4d3f',
    borderRadius: 1,
  },
  contentText: {
    textAlign: 'center',
    padding: 20,
    color: '#333',
  },
});

export default HistoryOrder;
