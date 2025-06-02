import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Avatar, Button, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAccentColors from '../../hooks/useAccentColors';
import useAuthStore from '../../store/useAuthStore';
import { useRouter } from '../../hooks/useRouter';
import AuthorizedRoute from '../../components/AuthorizedRoute';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const colors = useAccentColors();

  const handleLogout = async () => {
    await logout();
    router.replace('Auth');
  };

  const initials = `${user?.firstname?.[0] ?? ''}${user?.lastname?.[0] ?? ''}`.toUpperCase();
  const fullName = `${user?.firstname ?? ''} ${user?.lastname ?? ''}`.trim();
  const email = user?.email ?? 'Email no disponible';
  const createdDate = 'Fecha no disponible'; // mock
  const deliveriesCount = 37; // dato falso
  const rating = 4; // de 5, dato falso

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name={i < rating ? 'star' : 'star-outline'}
        size={20}
        color={colors.primary}
      />
    ));
  };

  return (
    <AuthorizedRoute>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Avatar.Text
            size={80}
            label={initials || '?'}
            style={[styles.avatar, { backgroundColor: colors.primary }]}
          />
          <Text style={styles.name}>{fullName || 'Nombre no disponible'}</Text>
          <Text style={styles.email}>{email}</Text>

          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Icon name="calendar" size={20} color={colors.primary} />
            <Text style={styles.infoText}>Miembro desde: {createdDate}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="truck-delivery-outline" size={20} color={colors.primary} />
            <Text style={styles.infoText}>Entregas realizadas: {deliveriesCount}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="star" size={20} color={colors.primary} />
            <Text style={styles.infoText}>Calificación promedio:</Text>
            <View style={styles.stars}>{renderStars()}</View>
          </View>
        </View>

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
    fontSize: 20,
    marginBottom: 4,
  },
  email: {
    color: '#555',
    marginBottom: 16,
  },
  divider: {
    width: '80%',
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
  },
  stars: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  logoutButton: {
    borderRadius: 8,
    paddingVertical: 6,
  },
});
