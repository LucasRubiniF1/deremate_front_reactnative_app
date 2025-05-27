import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PackageCard = ({ pkg }) => {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('PackageDetail', { id: pkg.id });
    };

    return (
        <TouchableOpacity onPress={handlePress} style={styles.touchable}>
            <View style={styles.card}>
                <Text style={styles.title}>Paquete #{pkg.id}</Text>
                <Text>Ubicación: {pkg.packageLocation}</Text>
                <Text>Estado: {pkg.status}</Text>
                <Text>Creado: {new Date(pkg.createdDate).toLocaleDateString()}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    touchable: {
        borderRadius: 8
    },
    card: {
        backgroundColor: '#fff',
        padding: 12,
        marginBottom: 10,
        borderRadius: 8,
        elevation: 2
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4
    }
});

export default PackageCard;
