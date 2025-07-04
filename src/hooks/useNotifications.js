import { Platform, PermissionsAndroid } from 'react-native';
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
    if (Platform.OS === 'ios') {
        const authStatus = await requestPermission(messaging);
        return (
            authStatus === AuthorizationStatus.AUTHORIZED ||
            authStatus === AuthorizationStatus.PROVISIONAL
        );
    } else if (Platform.OS === 'android') {
        try {
            const result = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            );
            return result === PermissionsAndroid.RESULTS.GRANTED;
        } catch (error) {
            console.error('Fallo al solicitar permiso en Android', error);
            return false;
        }
    }
    return false;
};

export const useNotifications = () => {
    const enableNotifications = async (onSuccess, onError) => {
        try {
            const granted = await requestUserPermission();
            if (!granted) throw new Error('Permiso denegado');

            const token = await getToken(messaging);
            await saveFirebaseDeviceToken(token);

            if (onSuccess) onSuccess();
        } catch (err) {
            console.error('Error en enableNotifications:', err);
            if (onError) onError(err);
        }
    };

    const disableNotifications = async (onSuccess, onError) => {
        try {
            const token = await getToken(messaging);
            await deleteToken(messaging);
            await deleteFirebaseTokenOnServer(token);

            if (onSuccess) onSuccess();
        } catch (err) {
            console.error('Error en disableNotifications:', err);
            if (onError) onError(err);
        }
    };

    return {
        enableNotifications,
        disableNotifications,
    };
};
