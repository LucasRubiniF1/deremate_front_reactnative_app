import { Platform, PermissionsAndroid } from 'react-native';
import { useState } from 'react';
import { getApp } from '@react-native-firebase/app';
import {
    getMessaging,
    getToken,
    requestPermission,
    deleteToken,
    AuthorizationStatus,
} from '@react-native-firebase/messaging';

import {
    saveFirebaseDeviceToken,
    deleteFirebaseTokenOnServer,
} from '../service/firebase.service';

const messaging = getMessaging(getApp());

const requestUserPermission = async () => {
    try {
        if (Platform.OS === 'ios') {
            const authStatus = await requestPermission(messaging);
            return (
                authStatus === AuthorizationStatus.AUTHORIZED ||
                authStatus === AuthorizationStatus.PROVISIONAL
            );
        }

        if (Platform.OS === 'android') {
            const result = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            );
            return result === PermissionsAndroid.RESULTS.GRANTED;
        }

        console.warn('[Permiso] Plataforma no soportada');
        return false;
    } catch (error) {
        console.error('[Permiso] Error solicitando permisos:', error);
        return false;
    }
};

export const useNotifications = () => {
    const enableNotifications = async (onSuccess, onError) => {
        try {
            const granted = await requestUserPermission();
            if (!granted) throw new Error('Permiso de notificaciones denegado');

            const token = await getToken(messaging);
            if (!token) throw new Error('Token de dispositivo vacío o inválido');

            await saveFirebaseDeviceToken(token);
            console.log('[Notificaciones] Token guardado:', token);

            if (onSuccess) onSuccess();
            return true;
        } catch (err) {
            console.error('[Notificaciones] Error al habilitar:', err);
            if (onError) onError(err);
            return false;
        }
    };

    const disableNotifications = async (onSuccess, onError) => {
        try {
            const token = await getToken(messaging);
            if (!token) throw new Error('Token de dispositivo vacío o inválido');

            try {
                await deleteToken(messaging);
            } catch (deleteErr) {
                console.warn('[Notificaciones] Token ya eliminado o error:', deleteErr.message);
            }

            await deleteFirebaseTokenOnServer(token);
            console.log('[Notificaciones] Token desvinculado del backend');

            if (onSuccess) onSuccess();
            return true;
        } catch (err) {
            console.error('[Notificaciones] Error al deshabilitar:', err);
            if (onError) onError(err);
            return false;
        }
    };

    return {
        enableNotifications,
        disableNotifications,
    };
};

// Global notification state management
export const useNotificationState = () => {
    const [notificationState, setNotificationState] = useState({
        show: false,
        title: '',
        body: '',
        data: {},
        timestamp: null
    });

    const showNotification = (notificationData) => {
        setNotificationState({
            show: true,
            ...notificationData
        });
    };

    const hideNotification = () => {
        setNotificationState(prev => ({
            ...prev,
            show: false
        }));
    };

    const clearNotification = () => {
        setNotificationState({
            show: false,
            title: '',
            body: '',
            data: {},
            timestamp: null
        });
    };

    return {
        notificationState,
        showNotification,
        hideNotification,
        clearNotification
    };
};
