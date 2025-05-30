import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Card, Avatar, Chip } from 'react-native-paper';

const getStatusColor = (status) => {
    switch (status) {
        case 'NOT_DELIVERED': return '#FFD700'; // Amarillo
        case 'REJECTED': return '#FF3B30';      // Rojo
        case 'DELIVERED': return '#34C759';     // Verde
        default: return '#999';                 // Gris
    }
};

const PackageCard = ({ pkg, onPress }) => {
    return (
        <Pressable onPress={() => onPress(pkg)} style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
            <Card style={styles.card} mode="contained">
                <View style={styles.row}>
                    <Avatar.Icon icon="archive-outline" size={36} style={styles.icon} />
                    <View style={styles.details}>
                        <Text style={styles.title}>Código: <Text style={styles.bold}>{pkg.id}</Text></Text>
                        <Text style={styles.text}>Ubicación en Depósito: {pkg.packageLocation}</Text>
                        <Chip style={[styles.chip, { backgroundColor: getStatusColor(pkg.status) }]} textStyle={styles.chipText}>
                            {pkg.status}
                        </Chip>
                    </View>
                </View>
            </Card>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    pressable: {
        marginBottom: 12,
        borderRadius: 12
    },
    pressed: {
        opacity: 0.85
    },
    card: {
        borderRadius: 12,
        elevation: 2,
        backgroundColor: '#fff',
        padding: 10
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        backgroundColor: '#e3e3e3',
        marginRight: 12
    },
    details: {
        flex: 1
    },
    title: {
        fontSize: 15,
        marginBottom: 4
    },
    bold: {
        fontWeight: 'bold'
    },
    text: {
        fontSize: 14,
        color: '#444'
    },
    chip: {
        alignSelf: 'flex-start',
        marginTop: 6,
    },
    chipText: {
        fontWeight: 'bold',
        color: '#000'
    }
});

export default PackageCard;
