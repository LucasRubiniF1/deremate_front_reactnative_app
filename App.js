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
  const [notificationData, setNotificationData] = useState({ 
    title: '', 
    body: '', 
    data: {},
    timestamp: null 
  });

  const formatNotificationData = (remoteMessage) => {
    const notification = remoteMessage.notification || {};
    const data = remoteMessage.data || {};
    
    // Use the original notification title and body as they come from backend
    return {
      title: notification.title || '¡Nueva Notificación!',
      body: notification.body || 'Sin contenido',
      data: data,
      timestamp: data.timestamp || new Date().toISOString()
    };
  };

  useEffect(() => {
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('[App] Foreground message received:', remoteMessage);
      const formattedData = formatNotificationData(remoteMessage);
      setNotificationData(formattedData);
      setShowNotification(true);
    });

    const unsubscribeOpened = messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        console.log('[App] Notification opened app:', remoteMessage);
        const formattedData = formatNotificationData(remoteMessage);
        setNotificationData(formattedData);
        setShowNotification(true);
      }
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('[App] Initial notification:', remoteMessage);
          const formattedData = formatNotificationData(remoteMessage);
          setNotificationData(formattedData);
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
          timestamp={notificationData.timestamp}
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
