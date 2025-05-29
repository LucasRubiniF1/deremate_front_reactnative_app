import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Text, ActivityIndicator, Divider } from 'react-native-paper';
import AuthorizedRoute from "../../components/AuthorizedRoute";
import { getDeliveriesByUserId } from '../../service/delivery.service';
import { SafeAreaView } from 'react-native-safe-area-context';

const formatDate = (date) => {
  if (!date) return 'No disponible';
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const d = new Date(date);
  return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()} a las ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

const DeliveryCard = ({ delivery }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#FFA500';
      case 'IN_PROGRESS': return '#007AFF';
      case 'COMPLETED': return '#34C759';
      case 'CANCELLED': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium">Entrega #{delivery.id}</Text>
          <Text style={[styles.status, { color: getStatusColor(delivery.status) }]}>
            {delivery.status}
          </Text>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.section}>
          <Text variant="titleSmall">Ubicación del Paquete</Text>
          <Text>{delivery.packageLocation}</Text>
        </View>
        <View style={styles.section}>
          <Text variant="titleSmall">Ruta</Text>
          <Text>Origen: {delivery.route.origin}</Text>
          <Text>Destino: {delivery.route.destination}</Text>
          {delivery.route.completedAt && <Text>Completada: {formatDate(delivery.route.completedAt)}</Text>}
        </View>
        <View style={styles.section}>
          <Text variant="titleSmall">Productos</Text>
          {delivery.products.map(product => (
            <View key={product.id} style={styles.productItem}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text>{product.description}</Text>
              <Text style={styles.price}>${product.price}</Text>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text variant="titleSmall">Fechas</Text>
          <Text>Creado: {formatDate(delivery.createdDate)}</Text>
          {delivery.deliveryStartDate && <Text>Inicio: {formatDate(delivery.deliveryStartDate)}</Text>}
          {delivery.deliveryEndDate && <Text>Finalizado: {formatDate(delivery.deliveryEndDate)}</Text>}
        </View>
      </Card.Content>
    </Card>
  );
};

export default function OrdersScreen() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDeliveries = async () => {
    try {
      const data = await getDeliveriesByUserId();
      setDeliveries(data);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDeliveries();
  };

  if (loading) {
    return (
      <AuthorizedRoute>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </SafeAreaView>
      </AuthorizedRoute>
    );
  }

  return (
    <AuthorizedRoute>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={deliveries}
          renderItem={({ item }) => <DeliveryCard delivery={item} />}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text>No hay entregas asignadas</Text>
            </View>
          }
        />
      </SafeAreaView>
    </AuthorizedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  status: {
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 8,
  },
  section: {
    marginBottom: 16,
  },
  productItem: {
    marginVertical: 4,
    padding: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 4,
  },
  productName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  price: {
    fontWeight: 'bold',
    color: '#34C759',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
