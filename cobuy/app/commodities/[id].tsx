import { StyleSheet, Text, View } from "react-native";
import React from 'react';
import { useLocalSearchParams } from "expo-router";

const Details = () => {
    const { id } = useLocalSearchParams();

    return (
        <View>
            <Text>商品詳細資訊：{id}</Text>
        </View>
    )
}

export default Details;
const styles = StyleSheet.create({})