import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthorizedRoute from '../../components/AuthorizedRoute';
import DeliveryCard from '../../components/DeliveryCard';
import { getDeliveriesByUser } from '../../service/delivery.service';
import { useTheme } from 'react-native-paper';

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    listContent: {
      padding: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
  });

export default function OrdersScreen() {
  console.log('[OrdersScreen] Component mounted');
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDeliveries = async () => {
    console.log('[OrdersScreen] Fetching deliveries...');
    try {
      const data = await getDeliveriesByUser();
      console.log('[OrdersScreen] Deliveries fetched successfully:', data.length, 'items');
      setDeliveries(data);
    } catch (error) {
      console.error('[OrdersScreen] Error fetching deliveries:', error);
    } finally {
      console.log('[OrdersScreen] Fetch operation completed');
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    console.log('[OrdersScreen] Initial fetch triggered');
    fetchDeliveries();

    return () => {
      console.log('[OrdersScreen] Component unmounting');
    };
  }, []);

  const onRefresh = () => {
    console.log('[OrdersScreen] Manual refresh triggered');
    setRefreshing(true);
    fetchDeliveries();
  };

  const theme = useTheme();
  const styles = getStyles(theme);

  if (loading) {
    console.log('[OrdersScreen] Rendering loading state');
    return (
      <AuthorizedRoute>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </SafeAreaView>
      </AuthorizedRoute>
    );
  }

  console.log('[OrdersScreen] Rendering deliveries list:', deliveries.length, 'items');
  return (
    <AuthorizedRoute>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={deliveries}
          renderItem={({ item }) => <DeliveryCard delivery={item} />}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
