import useAuthStore from "../store/useAuthStore";
import {useRootNavigationState} from "expo-router";

export const useDecisionEngine = () => {
  const { isAuthenticated } = useAuthStore()

  const rootNavigationState = useRootNavigationState()

  return {}
}
