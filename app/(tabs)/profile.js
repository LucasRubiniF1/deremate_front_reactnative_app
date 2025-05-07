import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Avatar } from 'react-native-paper';
import useAuthStore from '../../src/store/useAuthStore';
import {useRouter} from "expo-router";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('(auth)/sign-in');
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Avatar.Text size={64} label={user?.firstname?.charAt(0) + user?.lastname?.charAt(0) || '?'} style={styles.avatar} />
        <Text variant="titleLarge" style={styles.name}>
          { `${user?.firstname} ${user?.lastname}` || 'Nombre no disponible'}
        </Text>
        <Text variant="bodyMedium" style={styles.email}>
          {user?.email || 'Email no disponible'}
        </Text>
      </View>

      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        labelStyle={{ color: 'white' }}
      >
        Cerrar sesión
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
    backgroundColor: '#fff',
  },
  content: {
    alignItems: 'center',
    marginTop: 48,
  },
  avatar: {
    backgroundColor: '#7C61CB',
    marginBottom: 16,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    color: '#555',
  },
  logoutButton: {
    backgroundColor: '#D6336C',
    borderRadius: 8,
    paddingVertical: 6,
  },
});
