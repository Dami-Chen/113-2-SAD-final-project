import { View, Text } from 'react-native';
import React from 'react';
import { Tabs, Slot, useRouter } from 'expo-router';

const _Layout = () => {

    return (
        <Tabs>
            <Tabs.Screen
              name='index'
              options={{
                title: '主頁',
                headerShown: false
              }}
            />
            <Tabs.Screen
              name='profile'
              options={{
                title: '我'
              }}
            />
            <Tabs.Screen
              name='create_order'
              options={{
                title: '新增'
              }}
            />
            <Tabs.Screen
              name='notification'
              options={{
                title: '通知'
              }}
            />
            <Tabs.Screen
              name='history_order'
              options={{
                title: '我的訂單'
              }}
            />
        </Tabs>
    )
}

export default _Layout