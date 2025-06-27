import { useEffect } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useRouter} from "../hooks/useRouter";

export default function NavigateToDeliveryScreen() {
  const { params } = useRoute();
  const router = useRouter()
  const deliveryId = params?.deliveryId;

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('DeliveryDetails', { deliveryId });
    }, 300);

    return () => clearTimeout(timeout);
  }, [deliveryId]);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator />
      <Text>Navegando a entrega...</Text>
    </SafeAreaView>
  );
}
