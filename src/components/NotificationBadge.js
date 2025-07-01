import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

const NotificationBadge = ({ count, size = 20 }) => {
  const theme = useTheme();

  if (!count || count === 0) return null;

  const styles = StyleSheet.create({
    badge: {
      position: 'absolute',
      top: -5,
      right: -5,
      backgroundColor: theme.colors.error,
      borderRadius: size / 2,
      minWidth: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    text: {
      color: theme.colors.onError,
      fontSize: Math.max(10, size * 0.6),
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>
        {count > 99 ? '99+' : count.toString()}
      </Text>
    </View>
  );
};

export default NotificationBadge; 