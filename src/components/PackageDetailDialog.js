import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Dialog, Portal, Text, Button, Chip } from 'react-native-paper';

const getStatusStyle = () => ({
    backgroundColor: '#3F51B5',
    color: '#fff'
});

const PackageDetailDialog = ({ visible, onDismiss, pkg }) => {
    if (!pkg) return null;

    const statusStyle = getStatusStyle();

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
                <Dialog.Title>
                    <Text style={styles.bold}>Detalle del Paquete #{pkg.id}</Text>
                </Dialog.Title>
                <Dialog.Content>
                    <Chip icon="archive" style={styles.chip}>Código: {pkg.id}</Chip>

                    <View style={[styles.statusContainer, { backgroundColor: statusStyle.backgroundColor }]}>
                        <Text style={[styles.statusText, { color: statusStyle.color }]}>
                            {pkg.status}
                        </Text>
                    </View>

                    <Text style={styles.label}>
                        Ubicación: <Text style={styles.value}>{pkg.packageLocation}</Text>
                    </Text>

                    <Text style={styles.label}>
                        Creado: <Text style={styles.value}>
                            {new Date(pkg.createdDate).toLocaleString()}
                        </Text>
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
    bold: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    chip: {
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        marginTop: 6,
    },
    value: {
        fontWeight: '400',
        color: '#333',
    },
    statusContainer: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 10,
    },
    statusText: {
        fontWeight: 'bold',
        fontSize: 14,
    }
});

export default PackageDetailDialog;
