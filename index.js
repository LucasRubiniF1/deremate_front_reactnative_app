import { registerRootComponent } from 'expo';
import messaging from '@react-native-firebase/messaging';
import App from './App';

// Handle background messages
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('[Background] Message received:', remoteMessage);
  // You can perform any background tasks here
  // For example, update local storage, sync data, etc.
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
