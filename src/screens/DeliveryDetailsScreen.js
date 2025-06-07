import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import AuthorizedRoute from '../components/AuthorizedRoute';
import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { getDeliveryById } from '../service/delivery.service';
import { SimpleButton } from '../components/SimpleButton';

export default function DeliveryDetailsScreen() {
  const route = useRoute();
  const deliveryId = route.params?.deliveryId;

  const [deliveryData, setDeliveryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!deliveryId) {
      setLoading(false);
      setError('No se proporcionó un ID de delivery.');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDeliveryById(deliveryId);
        setDeliveryData(data); // Guardamos los datos reales en el estado.
      } catch (err) {
        setError('No se pudieron cargar los detalles del delivery.');
        console.error('[DeliveryDetailsScreen] Fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    console.log('Delivery data fetched successfully:', deliveryData);
  }, [deliveryId]);

  if (loading) {
    return (
      <AuthorizedRoute>
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text>Cargando detalles...</Text>
        </View>
      </AuthorizedRoute>
    );
  }

  if (error) {
    return (
      <AuthorizedRoute>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </AuthorizedRoute>
    );
  }

  return (
    <AuthorizedRoute>
      <View style={styles.container}>
        <Text style={styles.title}>Detalles del Delivery</Text>
        {deliveryData ? (
          <>
            <Text>ID: {deliveryData.id}</Text>
            <Text>Direccion destino: {deliveryData.destination}</Text>
          </>
        ) : (
          <Text>No se encontraron datos para este delivery.</Text>
        )}
        <SimpleButton label="Aceptar entrega" accent mode="contained" />
        <SimpleButton label="Rechazar entrega" accent mode="contained" />
      </View>
    </AuthorizedRoute>
  );
}

// Estilos para un mejor feedback visual
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
