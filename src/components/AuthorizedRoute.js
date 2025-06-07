import { useRef } from 'react';
import { AppState } from 'react-native';
import useAuthStore from '../store/useAuthStore';
import { useRouter } from '../hooks/useRouter';
import { useFocusEffect } from '@react-navigation/native';

export default function AuthorizedRoute({ children }) {
  const subscriptionRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleAppStateChange = nextAppState => {
    if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
      console.log('LOG: EVENT_ON_RESUME');
      if (!isAuthenticated) {
        router.replace('Auth');
      }
    }
    appStateRef.current = nextAppState;
  };

  useFocusEffect(() => {
    subscriptionRef.current = AppState.addEventListener('change', handleAppStateChange);

    const initialAppState = AppState.currentState;
    if (initialAppState === 'active') {
      handleAppStateChange(initialAppState);
    }

    return () => {
      if (subscriptionRef.current?.remove) {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
      }
    };
  });

  return children;
}
