import { useMemo, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootStack from './src/navigator/RootStack';
import { useColorScheme } from 'react-native';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import {flushPendingActions, navigationRef} from "./src/navigator/RootNavigation";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import { notificationService } from './src/service/notification.service';

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

  // Initialize notifications when app starts
  useEffect(() => {
    const initializeApp = async () => {
      console.log('[App] Initializing app...');
      
      // Initialize notification service
      await notificationService.initialize((message) => {
        console.log('[App] Notification received:', message);
        // Handle notification at app level if needed
      });
    };

    initializeApp();

    // Cleanup on app unmount
    return () => {
      notificationService.cleanup();
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
