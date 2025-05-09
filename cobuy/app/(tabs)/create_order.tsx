import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const CreateOrder = () => {
    return (
        <View style={styles.container} className='flex-1 bg-primary'>
            <Text style={styles.title} className="text-secondary">發起團購訂單</Text>
        </View>
    )
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
})

export default CreateOrder