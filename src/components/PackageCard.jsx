import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PackageCard = ({ pkg }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Paquete #{pkg.id}</Text>
            <Text>Ubicación: {pkg.packageLocation}</Text>
            <Text>Estado: {pkg.status}</Text>
            <Text>Creado: {new Date(pkg.createdDate).toLocaleDateString()}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
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
