import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useRootNavigationState } from 'expo-router';
import useAuthStore from '../store/useAuthStore';

export const useDecisionEngine = () => {
  const router = useRouter();

  useEffect(() => {
    const tryRestoreSession = async () => {
      await useAuthStore.getState().restoreSession();

      const { isAuthenticated } = useAuthStore.getState();

      if (!isAuthenticated) {
        router.replace('(auth)/sign-in');
      }
    };

    tryRestoreSession();
  }, []);

  return {};
};
