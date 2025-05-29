// src/components/PackageDetailDialog.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Dialog, Portal, Text, Button, Chip, Divider } from 'react-native-paper';

const PackageDetailDialog = ({ visible, onDismiss, pkg }) => {
    if (!pkg) return null;

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
                <Dialog.Title style={styles.title}>Detalle del Paquete #{pkg.id}</Dialog.Title>
                <Dialog.Content>
                    <Chip icon="archive" style={styles.chip}>Código: {pkg.id}</Chip>
                    <Text style={styles.label}>Estado: <Text style={styles.value}>{pkg.status}</Text></Text>
                    <Text style={styles.label}>Ubicación: <Text style={styles.value}>{pkg.packageLocation}</Text></Text>
                    <Text style={styles.label}>Creado: <Text style={styles.value}>{new Date(pkg.createdDate).toLocaleString()}</Text></Text>

                    {pkg.products?.length > 0 && (
                        <View style={{ marginTop: 12 }}>
                            <Divider style={{ marginBottom: 6 }} />
                            <Text style={styles.label}>Productos:</Text>
                            {pkg.products.map((p, idx) => (
                                <Text key={idx} style={styles.value}>• {p.name} - ${p.price}</Text>
                            ))}
                        </View>
                    )}
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
    chip: {
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        marginTop: 4
    },
    value: {
        fontWeight: '400',
        color: '#333'
    }
});

export default PackageDetailDialog;
