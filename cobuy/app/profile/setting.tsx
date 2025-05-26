

import { View, Text, Switch, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';

export default function SettingScreen() {
  const [notif1, setNotif1] = useState(false);
  const [notif2, setNotif2] = useState(false);
  const [notif3, setNotif3] = useState(false);

  const [privacy1, setPrivacy1] = useState(false);
  const [privacy2, setPrivacy2] = useState(false);
  const [privacy3, setPrivacy3] = useState(false);

  const [perm1, setPerm1] = useState(false);
  const [perm2, setPerm2] = useState(false);
  const [perm3, setPerm3] = useState(false);
  const [perm4, setPerm4] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>{'< 返回'}</Text>
      </TouchableOpacity>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>通知設定</Text>
        <SettingRow label="新訊息" value={notif1} onValueChange={setNotif1} />
        <SettingRow label="新拼單者加入" value={notif2} onValueChange={setNotif2} />
        <SettingRow label="拼單成功" value={notif3} onValueChange={setNotif3} />
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>隱私設定</Text>
        <SettingRow label="公開個人資訊" value={privacy1} onValueChange={setPrivacy1} />
        <SettingRow label="公開聯絡資訊" value={privacy2} onValueChange={setPrivacy2} />
        <SettingRow label="允許私訊" value={privacy3} onValueChange={setPrivacy3} />
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>權限設定</Text>
        <SettingRow label="允許使用行動網路" value={perm1} onValueChange={setPerm1} />
        <SettingRow label="允許使用照相機" value={perm2} onValueChange={setPerm2} />
        <SettingRow label="允許使用相簿" value={perm3} onValueChange={setPerm3} />
        <SettingRow label="允許使用檔案" value={perm4} onValueChange={setPerm4} />
      </View>
    </ScrollView>
  );
}

function SettingRow({ label, value, onValueChange }: any) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    padding: 20,
  },
  back: {
    fontSize: 20,
    color: '#8C5C47',
    marginBottom: 10,
    marginTop: 20, // Add top margin to push it down
  },
  block: {
    backgroundColor: '#F2E4D3',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  blockTitle: {
    backgroundColor: '#8C5C47',
    color: 'white',
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  label: {
    fontSize: 16,
    color: '#5E3D28',
  },
});