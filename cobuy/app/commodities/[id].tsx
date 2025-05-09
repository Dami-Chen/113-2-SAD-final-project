import { Button, StyleSheet, Text, SafeAreaView } from "react-native";
import React from 'react';
import { useRouter, useLocalSearchParams } from "expo-router";

const CommodityDetails = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    return (
    <SafeAreaView className="p-4 flex-1 bg-primary">
        <Text className="text-xl text-secondary font-bold mb-2">商品詳情</Text>
        <Text className="text-dark">你選擇的商品 ID 是：{id}</Text>
        {/* 實際上你可以根據 id 去 fetch 詳細資料 */}
        <Button title="返回" onPress={() => router.push('/')}/>
    </SafeAreaView>
    )
}

export default CommodityDetails;
const styles = StyleSheet.create({})