import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthorizedRoute from '../../components/AuthorizedRoute';
import DeliveryCard from '../../components/DeliveryCard';
import { getDeliveriesByUser } from '../../service/delivery.service';
import { useTheme } from 'react-native-paper';
import { SimpleSnackbar } from '../../components/SimpleSnackbar';
import { useNotificationClose, useSpecificNotificationClose } from '../../hooks/useNotificationClose';

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

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarMode, setSnackbarMode] = useState('success');

  
  useNotificationClose(() => {
    console.log('[OrdersScreen] Notification was closed - refreshing deliveries...');
    fetchDeliveries(); 
  });

  
  useSpecificNotificationClose('delivery', (notificationData) => {
    console.log('[OrdersScreen] Delivery notification closed:', notificationData);
 
    if (notificationData?.data?.action === 'refresh_deliveries') {
      fetchDeliveries();
    }
  });

  
  useSpecificNotificationClose('status', (notificationData) => {
    console.log('[OrdersScreen] Status change notification closed:', notificationData);
    
    fetchDeliveries();
  });

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

  const handleSnackbarMode = newMode => {
    if (newMode === 'success') {
      onRefresh();
    }
    setSnackbarMode(newMode);
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
          renderItem={({ item }) => (
            <DeliveryCard
              delivery={item}
              setSnackbarMode={handleSnackbarMode}
              setSnackbarMessage={setSnackbarMessage}
              setSnackbarVisible={setSnackbarVisible}
            />
          )}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text>No hay entregas asignadas</Text>
            </View>
          }
        />
        <SimpleSnackbar
          mode={snackbarMode}
          text={snackbarMessage}
          closeLabel="OK"
          setVisible={setSnackbarVisible}
          visible={snackbarVisible}
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
