import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const NotificationModal = ({ visible, onClose, title, body }) => {
    const theme = useTheme();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
                    <MaterialIcons name="inventory" size={40} color={theme.colors.primary} />
                    <Text style={styles.title}>{title || '¡Nueva Notificación!'}</Text>
                    <Text style={styles.body}>
                        {typeof body === 'string' && body.trim() !== '' ? body : 'Tienes una nueva notificación'}
                    </Text>
                    <Button mode="contained" onPress={onClose} style={styles.button}>
                        OK
                    </Button>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        width: '80%',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 6,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 12,
        textAlign: 'center',
    },
    body: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        marginVertical: 12,
    },
    button: {
        marginTop: 10,
        width: '60%',
    },
});

export default NotificationModal;
