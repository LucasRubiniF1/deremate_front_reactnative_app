import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Divider, Text } from 'react-native-paper';

const formatDate = (date) => {
    if (!date) return 'No disponible';
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const d = new Date(date);
    return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()} a las ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

const DeliveryCard = ({ delivery }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return '#FFA500';
            case 'IN_PROGRESS': return '#007AFF';
            case 'COMPLETED': return '#34C759';
            case 'CANCELLED': return '#FF3B30';
            default: return '#8E8E93';
        }
    };

    return (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.header}>
                    <Text variant="titleMedium">Entrega #{delivery.id}</Text>
                    <Text style={[styles.status, { color: getStatusColor(delivery.status) }]}>
                        {delivery.status}
                    </Text>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.section}>
                    <Text variant="titleSmall">Ubicación del Paquete</Text>
                    <Text>{delivery.packageLocation}</Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleSmall">Ruta</Text>
                    <Text>Origen: {delivery.route.origin}</Text>
                    <Text>Destino: {delivery.route.destination}</Text>
                    {delivery.route.completedAt && <Text>Completada: {formatDate(delivery.route.completedAt)}</Text>}
                </View>

                <View style={styles.section}>
                    <Text variant="titleSmall">Fechas</Text>
                    <Text>Creado: {formatDate(delivery.createdDate)}</Text>
                    {delivery.deliveryStartDate && <Text>Inicio: {formatDate(delivery.deliveryStartDate)}</Text>}
                    {delivery.deliveryEndDate && <Text>Finalizado: {formatDate(delivery.deliveryEndDate)}</Text>}
                </View>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    status: {
        fontWeight: 'bold',
    },
    divider: {
        marginVertical: 8,
    },
    section: {
        marginBottom: 16,
    },
});

export default DeliveryCard;
