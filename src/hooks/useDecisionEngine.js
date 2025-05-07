import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useRootNavigationState } from 'expo-router';
import useAuthStore from '../store/useAuthStore';

export const useDecisionEngine = () => {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    const tryRestoreSession = async () => {
      console.log(useAuthStore)
      /*
      await useAuthStore.getState().restoreSession();

      const { isAuthenticated } = useAuthStore.getState();

      if (!isAuthenticated && rootNavigationState?.key) {
        router.replace('(auth)/sign-in');
      }
      
       */
    };

    tryRestoreSession();
  }, [rootNavigationState]);

  return {};
};
