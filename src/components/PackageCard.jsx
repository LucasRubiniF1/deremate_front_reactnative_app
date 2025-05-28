import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Avatar } from 'react-native-paper';

const PackageCard = ({ pkg }) => {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('PackageDetail', { id: pkg.id });
    };

    return (
        <Pressable onPress={handlePress} style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
            <Card style={styles.card} mode="contained">
                <View style={styles.row}>
                    <Avatar.Icon icon="archive-outline" size={36} style={styles.icon} />
                    <View style={styles.details}>
                        <Text style={styles.title}>Código: {pkg.id}</Text>
                        <Text style={styles.text}>Ubicación en Depósito: {pkg.packageLocation}</Text>
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
        fontWeight: 'bold',
        fontSize: 15,
        marginBottom: 4
    },
    text: {
        fontSize: 14,
        color: '#444'
    }
});

export default PackageCard;
