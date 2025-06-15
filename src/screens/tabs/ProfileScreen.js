import { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Text, Avatar, Button, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuthStore from '../../store/useAuthStore';
import { useRouter } from '../../hooks/useRouter';
import AuthorizedRoute from '../../components/AuthorizedRoute';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';
import { info } from '../../service/user.service';

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
      padding: 24,
      backgroundColor: theme.colors.background,
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
      color: theme.colors.onBackground,
    },
    email: {
      color: theme.colors.onSurfaceVariant,
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
      color: theme.colors.onBackground,
    },
    stars: {
      flexDirection: 'row',
      marginLeft: 8,
    },
    logoutButton: {
      borderRadius: theme.roundness * 2,
      paddingVertical: 6,
    },
  });

export default function ProfileScreen() {
  console.log('[ProfileScreen] Component mounted');
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const theme = useTheme();
  const styles = getStyles(theme);

  const handleLogout = async () => {
    console.log('[ProfileScreen] Logout initiated');
    try {
      await logout();
      console.log('[ProfileScreen] Logout successful, navigating to Auth screen');
      router.replace('Auth');
    } catch (error) {
      console.error('[ProfileScreen] Logout failed:', error);
    }
  };

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userInfo, setUserInfo] = useState(user);

  const fetchUserInfo = async () => {
    console.log('[ProfileScreen] Fetching user info...');
    try {
      const data = await info();
      console.log('[ProfileScreen] User info fetched successfully:', {
        name: `${data.firstname} ${data.lastname}`,
        deliveriesCompleted: data.deliveriesCompleted,
      });
      setUserInfo(data);
    } catch (error) {
      console.error('[ProfileScreen] Error fetching user info:', error);
    } finally {
      console.log('[ProfileScreen] Fetch operation completed');
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    console.log('[ProfileScreen] Initial user data:', {
      email: user?.email,
      hasUserInfo: !!userInfo,
    });
    fetchUserInfo();

    return () => {
      console.log('[ProfileScreen] Component unmounting');
    };
  }, []);

  const initials =
    `${userInfo?.firstname?.[0] ?? ''}${userInfo?.lastname?.[0] ?? ''}`.toUpperCase();
  const fullName = `${userInfo?.firstname ?? ''} ${userInfo?.lastname ?? ''}`.trim();
  const userEmail = user?.email ?? 'Email no disponible';
  const createdDate = 'Fecha no disponible';
  const deliveriesCount = userInfo?.deliveriesCompleted ?? 0;
  const rating = 4;

  console.log('[ProfileScreen] Rendering with user data:', {
    initials,
    fullName,
    userEmail,
    deliveriesCount,
    rating,
  });

  const renderStars = () => {
    console.log('[ProfileScreen] Rendering star rating:', rating);
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name={i < rating ? 'star' : 'star-outline'}
        size={20}
        color={theme.colors.primary}
      />
    ));
  };

  if (loading) {
    console.log('[ProfileScreen] Rendering loading state');
    return (
      <AuthorizedRoute>
        <SafeAreaView style={styles.container}>
          <ActivityIndicator size="large" style={{ flex: 1 }} />
        </SafeAreaView>
      </AuthorizedRoute>
    );
  }

  return (
    <AuthorizedRoute>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Avatar.Text
            size={80}
            label={initials || '?'}
            style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
          />
          <Text style={styles.name}>{fullName || 'Nombre no disponible'}</Text>
          <Text style={styles.email}>{userEmail}</Text>

          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Icon name="calendar" size={20} color={theme.colors.primary} />
            <Text style={styles.infoText}>Miembro desde: {createdDate}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="truck-delivery-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.infoText}>Entregas realizadas: {deliveriesCount}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="star" size={20} color={theme.colors.primary} />
            <Text style={styles.infoText}>Calificación promedio:</Text>
            <View style={styles.stars}>{renderStars()}</View>
          </View>
        </View>

        <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
          Cerrar sesión
        </Button>
      </SafeAreaView>
    </AuthorizedRoute>
  );
}
