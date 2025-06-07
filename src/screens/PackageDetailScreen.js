import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Button } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AuthorizedService } from '../api/apiClient';

const PackageDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const res = await AuthorizedService.get(`/v1/delivery/${id}`);
        setDelivery(res.data);
      } catch (err) {
        Alert.alert('Error', 'No se pudo cargar el detalle del paquete.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDelivery();
  }, [id]);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (!delivery) return <Text style={styles.error}>No se encontró el paquete</Text>;

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
