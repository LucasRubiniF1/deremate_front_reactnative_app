import React, { useMemo, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootStack from './src/navigator/RootStack';
import { useColorScheme } from 'react-native';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { flushPendingActions, navigationRef } from './src/navigator/RootNavigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import messaging from '@react-native-firebase/messaging';
import NotificationModal from './src/components/NotificationModal';

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

export default function App() {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme({ fallbackSourceColor: '#3a86ff' });

  const paperTheme = useMemo(() => {
    return colorScheme === 'dark'
      ? { ...MD3DarkTheme, colors: { ...theme.dark, ...CustomColors } }
      : { ...MD3LightTheme, colors: { ...theme.light, ...CustomColors } };
  }, [colorScheme, theme]);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({ title: '', body: '' });

  useEffect(() => {
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      setNotificationData({
        title: remoteMessage.notification?.title || '¡Nueva Notificación!',
        body: remoteMessage.notification?.body || 'Sin contenido',
      });
      setShowNotification(true);
    });

    const unsubscribeOpened = messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        setNotificationData({
          title: remoteMessage.notification?.title || '¡Notificación!',
          body: remoteMessage.notification?.body || 'Sin contenido',
        });
        setShowNotification(true);
      }
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          setNotificationData({
            title: remoteMessage.notification?.title || '¡Notificación!',
            body: remoteMessage.notification?.body || 'Sin contenido',
          });
          setShowNotification(true);
        }
      });

    return () => {
      unsubscribeForeground();
      unsubscribeOpened();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={paperTheme}>
        <NotificationModal
          visible={showNotification}
          onClose={() => setShowNotification(false)}
          title={notificationData.title}
          body={notificationData.body}
        />
        <SafeAreaProvider>
          <NavigationContainer
            ref={navigationRef}
            onReady={() => flushPendingActions()}
          >
            <RootStack />
          </NavigationContainer>
        </SafeAreaProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
