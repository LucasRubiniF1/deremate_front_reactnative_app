import { useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import { useRouter } from './useRouter';

export const useDecisionEngine = () => {
  const router = useRouter();

  useEffect(() => {
    const tryRestoreSession = async () => {
      await useAuthStore.getState().restoreSession();

      const { isAuthenticated } = useAuthStore.getState();

      if (!isAuthenticated) {
        router.replace('Auth', { screen: 'SignIn' });
      } else {
        router.replace('BiometricAuth');
      }
    };

    tryRestoreSession();
  }, []);

  return {};
};
