import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Dialog, Portal, Text, Button, Chip } from 'react-native-paper';

const getStatusColor = (status) => {
    switch (status) {
        case 'NOT_DELIVERED': return '#FFD700'; // Amarillo
        case 'REJECTED': return '#FF3B30';      // Rojo
        case 'DELIVERED': return '#34C759';     // Verde
        default: return '#999';                 // Gris por defecto
    }
};

const PackageDetailDialog = ({ visible, onDismiss, pkg }) => {
    if (!pkg) return null;

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
                <Dialog.Title style={styles.title}>
                    <Text style={styles.bold}>Detalle del Paquete #{pkg.id}</Text>
                </Dialog.Title>
                <Dialog.Content>
                    <Chip icon="archive" style={styles.chip}>Código: {pkg.id}</Chip>

                    <Text style={styles.label}>
                        Estado: <Text style={[styles.value, { color: getStatusColor(pkg.status) }]}>{pkg.status}</Text>
                    </Text>

                    <Text style={styles.label}>
                        Ubicación: <Text style={styles.value}>{pkg.packageLocation}</Text>
                    </Text>

                    <Text style={styles.label}>
                        Creado: <Text style={styles.value}>{new Date(pkg.createdDate).toLocaleString()}</Text>
                    </Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onDismiss} mode="contained-tonal">Cerrar</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    dialog: {
        borderRadius: 12,
    },
    title: {
        fontWeight: 'bold',
    },
    bold: {
        fontWeight: 'bold',
        fontSize: 18
    },
    chip: {
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        marginTop: 4,
    },
    value: {
        fontWeight: '400',
        color: '#333',
    }
});

export default PackageDetailDialog;
