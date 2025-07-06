import React from 'react';
import { Modal, View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const NotificationModal = ({ visible, onClose, title, body, timestamp }) => {
    const theme = useTheme();

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        try {
            const date = new Date(timestamp);
            return date.toLocaleString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return '';
        }
    };

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
                    
                    <ScrollView style={styles.bodyContainer} showsVerticalScrollIndicator={false}>
                        <Text style={styles.body}>
                            {typeof body === 'string' && body.trim() !== '' ? body : 'Tienes una nueva notificación'}
                        </Text>
                        
                        {timestamp && (
                            <Text style={styles.timestamp}>
                                📅 {formatTimestamp(timestamp)}
                            </Text>
                        )}
                    </ScrollView>
                    
                    <View style={styles.buttonContainer}>
                        <Button 
                            mode="contained" 
                            onPress={onClose} 
                            style={styles.button}
                        >
                            OK
                        </Button>
                    </View>
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
        maxHeight: '80%',
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
    bodyContainer: {
        width: '100%',
        maxHeight: 200,
    },
    body: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        marginVertical: 12,
    },

    timestamp: {
        fontSize: 12,
        color: '#555',
        textAlign: 'center',
        marginVertical: 12,
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        width: '100%',
    },
    button: {
        width: '60%',
    },
});

export default NotificationModal;
