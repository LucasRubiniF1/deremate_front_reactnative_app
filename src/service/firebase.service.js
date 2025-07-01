import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

// Request permission for push notifications
export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('[Firebase] Authorization status:', authStatus);
    return true;
  } else {
    console.log('[Firebase] Permission denied');
    return false;
  }
};

// Get the FCM token
export const getFCMToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log('[Firebase] FCM Token:', token);
    return token;
  } catch (error) {
    console.error('[Firebase] Error getting FCM token:', error);
    return null;
  }
};

export const onMessageReceived = () => {
       return messaging().onMessage(async remoteMessage => {
         console.log('[Firebase] Foreground message received:', remoteMessage);
         
         // Muestra una notificación local en lugar de un Alert
         await Notifications.presentNotificationAsync({
           title: remoteMessage.notification?.title || 'Nuevo Paquete',
           body: remoteMessage.notification?.body || 'Hay un nuevo paquete disponible.',
           data: remoteMessage.data, 
         });
       });
     };
     
     // --- FUNCIÓN DE INICIALIZACIÓN COMPLETA ---
     export const initializeFirebaseMessaging = async (onNewPackage) => {
       try {
         const hasPermission = await requestUserPermission();
         if (!hasPermission) {
           console.log('[Firebase] No permission for notifications');
           return false;
         }
     
         const token = await getFCMToken();
         if (!token) {
           console.log('[Firebase] Could not get FCM token');
           return false;
         }
     
         // <<< SUGERENCIA: Escuchar si el token cambia >>>
         messaging().onTokenRefresh(newToken => {
           console.log('[Firebase] Nuevo token generado:', newToken);
           // TODO: Enviar este 'newToken' a tu backend para actualizarlo
           // sendTokenToBackend(newToken); 
         });
     
         const unsubscribeForeground = onMessageReceived();
         const unsubscribeBackground = onNotificationOpenedApp(onNewPackage);
         
         await getInitialNotification(onNewPackage);
     
         // <<< ELIMINADO de aquí y movido a index.js >>>
         // messaging().setBackgroundMessageHandler(onBackgroundMessage);
     
         console.log('[Firebase] Messaging initialized successfully');
         
         return {
           token,
           unsubscribe: () => {
             unsubscribeForeground();
             unsubscribeBackground();
           }
         };
       } catch (error) {
         console.error('[Firebase] Error initializing messaging:', error);
         return false;
       }
     };