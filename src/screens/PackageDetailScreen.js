import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Button } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AuthorizedService } from '../api/apiClient';

const PackageDetailScreen = () => {
  console.log('[PackageDetailScreen] Component mounted');
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(`[PackageDetailScreen] Fetching delivery details for ID: ${id}`);
    const fetchDelivery = async () => {
      try {
        console.log('[PackageDetailScreen] Making API request...');
        const res = await AuthorizedService.get(`/v1/delivery/${id}`);
        console.log('[PackageDetailScreen] API response received:', res.data);
        setDelivery(res.data);
      } catch (err) {
        console.error('[PackageDetailScreen] Error fetching delivery:', err);
        Alert.alert('Error', 'No se pudo cargar el detalle del paquete.');
      } finally {
        console.log('[PackageDetailScreen] Fetch operation completed');
        setLoading(false);
      }
    };
    fetchDelivery();

    return () => {
      console.log('[PackageDetailScreen] Component unmounting');
    };
  }, [id]);

  if (loading) {
    console.log('[PackageDetailScreen] Rendering loading state');
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }
  if (!delivery) {
    console.log('[PackageDetailScreen] No delivery data found');
    return <Text style={styles.error}>No se encontró el paquete</Text>;
  }

  console.log('[PackageDetailScreen] Rendering delivery details');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle del Paquete #{delivery.id}</Text>
      <Text>Estado: {delivery.status}</Text>
      <Text>Ubicación: {delivery.packageLocation}</Text>
      <Text>Creado: {new Date(delivery.createdDate).toLocaleString()}</Text>

      {/* Información sensible removida */}
      {/* 
      {delivery.products?.length > 0 && (
        <>
          <Text style={styles.subtitle}>Productos:</Text>
          {delivery.products.map((p, idx) => (
            <Text key={idx}>• {p.name} - ${p.price}</Text>
          ))}
        </>
      )} 
      */}

      <View style={{ marginTop: 20 }}>
        <Button title="Volver" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { marginTop: 12, fontWeight: '600' },
  error: { flex: 1, textAlign: 'center', color: 'red', marginTop: 20 },
});

export default PackageDetailScreen;
