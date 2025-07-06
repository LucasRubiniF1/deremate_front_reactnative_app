import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useNotificationClose, useSpecificNotificationClose } from '../hooks/useNotificationClose';

/**
 * Example component showing different ways to use notification close effects
 */
const NotificationCloseExample = () => {
  const [lastClosedNotification, setLastClosedNotification] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);

  // Example 1: Simple effect when any notification is closed
  useNotificationClose(() => {
    console.log('[Example] Any notification was closed');
    setRefreshCount(prev => prev + 1);
  });

  // Example 2: Effect with notification data
  useNotificationClose((notificationData) => {
    console.log('[Example] Notification closed with data:', notificationData);
    setLastClosedNotification(notificationData);
  }, [], { includeData: true });

  // Example 3: Effect for specific notification type
  useSpecificNotificationClose('package', (notificationData) => {
    console.log('[Example] Package notification was closed:', notificationData);
    // Handle package-specific logic
  });

  // Example 4: Effect for delivery notifications
  useSpecificNotificationClose('delivery', (notificationData) => {
    console.log('[Example] Delivery notification was closed:', notificationData);
    // Handle delivery-specific logic
  });

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Notification Close Effects</Text>
        <Text style={styles.subtitle}>
          This component demonstrates different notification close effects
        </Text>
        
        <Text style={styles.info}>
          Refresh count: {refreshCount}
        </Text>
        
        {lastClosedNotification && (
          <View style={styles.notificationInfo}>
            <Text style={styles.label}>Last closed notification:</Text>
            <Text style={styles.data}>
              Title: {lastClosedNotification.title}
            </Text>
            <Text style={styles.data}>
              Type: {lastClosedNotification.data?.type || 'Unknown'}
            </Text>
          </View>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  info: {
    fontSize: 16,
    marginBottom: 12,
  },
  notificationInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  data: {
    fontSize: 12,
    color: '#666',
  },
});

export default NotificationCloseExample; 