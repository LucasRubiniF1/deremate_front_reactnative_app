import { useMemo, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootStack from './src/navigator/RootStack';
import { useColorScheme, Alert } from 'react-native';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { flushPendingActions, navigationRef } from './src/navigator/RootNavigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';

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

  const paperTheme = useMemo(
    () =>
      colorScheme === 'dark'
        ? { ...MD3DarkTheme, colors: { ...theme.dark, ...CustomColors } }
        : { ...MD3LightTheme, colors: { ...theme.light, ...CustomColors } },
    [colorScheme, theme]
  );

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('¡Nueva Notificación!', JSON.stringify(remoteMessage.notification?.body));
    });

    return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={paperTheme}>
        <SafeAreaProvider>
          <NavigationContainer
            ref={navigationRef}
            onReady={() => {
              flushPendingActions();
            }}
          >
            <RootStack />
          </NavigationContainer>
        </SafeAreaProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Notificación recibida en segundo plano:', remoteMessage);
});
