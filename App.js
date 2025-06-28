import { useEffect, useMemo } from 'react';
import { Platform, useColorScheme } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import RootStack from './src/navigator/RootStack';
import { flushPendingActions, navigationRef } from './src/navigator/RootNavigation';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';

const CustomColors = {
  warning: '#FFB300',
  onWarning: '#000000',
  warningContainer: '#FFF8E1',
  onWarningContainer: '#664A00',
  success: '#388E3C',
  onSuccess: '#FFFFFF',
  successContainer: '#E8F5E9',
  onSuccessContainer: '#1E4620',
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme({ fallbackSourceColor: '#3a86ff' });

  const paperTheme = useMemo(
    () =>
      colorScheme === 'dark'
        ? { ...MD3DarkTheme, colors: { ...theme.dark, ...CustomColors } }
        : { ...MD3LightTheme, colors: { ...theme.light, ...CustomColors } },
    [colorScheme, theme]
  );

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      console.log('Expo Push Token:', token);
      // TODO: podés guardar el token en tu backend
    });

    const subscription1 = Notifications.addNotificationReceivedListener(notification => {
      console.log('📩 Notificación recibida:', notification);
    });

    const subscription2 = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('🟢 Usuario tocó la notificación:', response);
    });

    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={paperTheme}>
        <SafeAreaProvider>
          <NavigationContainer
            ref={navigationRef}
            onReady={() => {
              flushPendingActions();
            }}>
            <RootStack />
          </NavigationContainer>
        </SafeAreaProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('No se concedieron permisos para notificaciones push');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    })).data;
  } else {
    alert('Las notificaciones solo funcionan en dispositivos físicos');
  }

  // Canal para Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return token;
}
