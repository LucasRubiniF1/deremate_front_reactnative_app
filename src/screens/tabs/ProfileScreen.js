import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, Button, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAccentColors from "../../hooks/useAccentColors";
import useAuthStore from "../../store/useAuthStore";
import { useRouter } from "../../hooks/useRouter";
import AuthorizedRoute from "../../components/AuthorizedRoute";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const colors = useAccentColors();

  const handleLogout = async () => {
    await logout();
    router.replace('Auth');
  };

  return (
    <AuthorizedRoute>
      <SafeAreaView style={styles.container}>
        <SafeAreaView style={styles.content}>
          <Avatar.Text
            size={64}
            label={user?.firstname?.charAt(0) + user?.lastname?.charAt(0) || '?'}
            style={[styles.avatar, { backgroundColor: colors.primary }]}
          />
          <Text variant="titleLarge" style={styles.name}>
            {`${user?.firstname ?? 'Cerrando'} ${user?.lastname ?? 'sesión'}` || 'Nombre no disponible'}
          </Text>
          <Text variant="bodyMedium" style={styles.email}>
            {user?.email || 'Email no disponible'}
          </Text>
        </SafeAreaView>

        <Button
          mode="contained"
          onPress={handleLogout}
          style={[styles.logoutButton, { backgroundColor: colors.primary }]}
          labelStyle={{ color: 'white' }}
        >
          Cerrar sesión
        </Button>
      </SafeAreaView>
    </AuthorizedRoute>
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
    borderRadius: 8,
    paddingVertical: 6,
  },
});
