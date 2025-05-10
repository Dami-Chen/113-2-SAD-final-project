import { Text, SafeAreaView, TouchableOpacity, FlatList, TextInput } from "react-native";
import {Link} from 'expo-router';
import { useState } from "react";

// 先放寫死的假資料，之後可能要用 API fetch
const products = [
  { id: '1', name: 'Costco 煙燻鮭魚抹醬' },
  { id: '2', name: '高麗菜' },
  { id: '3', name: '提拉米蘇的提拉米蘇' },
]

export default function Index() {
  const [ searchTerm, setSearchTerm ] = useState('');
  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-primary">
      <Text className="text-3xl text-secondary font-bold mb-4">Welcome to CoBuy bitch</Text>
      <TextInput
        placeholder="搜尋商品名稱"
        value={searchTerm}
        onChangeText={setSearchTerm}
        className="bg-primary text-secondary rounded p-2 mb-4 border border-block"
      />
      <Text className="text-xl font-bold mb-4 text-secondary">商品列表</Text>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link
            href={`/commodities/${item.id}`}
            asChild
          >
            <TouchableOpacity className="p-4 bg-block mb-2 rounded">
              <Text className="text-dark">{item.name}</Text>
            </TouchableOpacity>
          </Link>
        )}
      />
    </SafeAreaView>  
  );
} 
