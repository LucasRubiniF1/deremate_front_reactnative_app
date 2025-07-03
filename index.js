import { registerRootComponent } from 'expo';
import { getApp } from '@react-native-firebase/app';
import { getMessaging } from '@react-native-firebase/messaging';
import App from './App';

const messaging = getMessaging(getApp());

messaging.setBackgroundMessageHandler(async remoteMessage => {
  console.log('[Background] Message received:', remoteMessage);
  // Acá podés guardar en storage, actualizar caché, etc.
});

registerRootComponent(App);
