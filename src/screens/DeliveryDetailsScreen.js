import { ActivityIndicator, StyleSheet, Alert } from 'react-native';
import AuthorizedRoute from '../components/AuthorizedRoute';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { getDeliveryById } from '../service/delivery.service';
import { SimpleButton } from '../components/SimpleButton';
import { useTheme, Text, Card } from 'react-native-paper';
import { acceptRouteById } from '../service/route.service';
import { useRouter } from '../hooks/useRouter';
import { SafeAreaView } from 'react-native-safe-area-context';

const getStyles = theme =>
  StyleSheet.create({
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    addressText: {
      fontSize: 18,
      marginBottom: 16,
      color: theme.colors.onSurface,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    errorText: {
      color: 'red',
      fontSize: 16,
    },
    acceptButton: {
      marginTop: 16,
      backgroundColor: theme.colors.primary,
      padding: 12,
      borderRadius: theme.roundness,
    },
    rejectButton: {
      marginTop: 16,
      backgroundColor: theme.colors.warning,
      padding: 12,
      borderRadius: theme.roundness,
    },
  });

export default function DeliveryDetailsScreen() {
  const route = useRoute();
  const router = useRouter();
  const deliveryId = route.params?.deliveryId;
  const navigation = useNavigation();
  const [deliveryData, setDeliveryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const theme = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    if (!deliveryId) {
      setLoading(false);
      setError('No se proporcionó un ID de delivery.');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDeliveryById(deliveryId);
        setDeliveryData(data);
      } catch (err) {
        setError('No se pudieron cargar los detalles del delivery.');
        console.error('[DeliveryDetailsScreen] Fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [deliveryId]);

  const handleAcceptDelivery = async () => {
    // Prevenir múltiples ejecuciones
    if (isAccepting || isRejecting) {
      return;
    }

    setIsAccepting(true);

    try {
      // Validación de datos
      if (!deliveryData?.route?.id) {
        throw new Error('Datos de entrega inválidos');
      }

      console.log('Accepting delivery for route ID:', deliveryData.route.id);

      // Llamada al servicio
      await acceptRouteById(deliveryData.route.id);

      // Éxito: navegar primero, luego mostrar alert
      navigation.navigate('MainTabs', {
        screen: 'Orders',
      });

      // Usar setTimeout para que el alert aparezca después de la navegación
      setTimeout(() => {
        Alert.alert('Éxito', 'Entrega aceptada correctamente', [{ text: 'OK' }]);
      }, 100);
    } catch (error) {
      console.error('[DeliveryDetailsScreen] Accept delivery failed:', error);
      Alert.alert('Error', error.message || 'Error al aceptar la entrega', [{ text: 'OK' }]);
    } finally {
      // CRÍTICO: Siempre resetear el estado
      setIsAccepting(false);
    }
  };

  const handleRejectDelivery = async () => {
    if (isRejecting || isAccepting) {
      return;
    }

    setIsRejecting(true);

    try {
      setTimeout(() => {
        router.replace('MainTabs');
      }, 200);
    } finally {
      setIsRejecting(false);
    }
  };

  if (loading) {
    return (
      <AuthorizedRoute>
        <SafeAreaView style={styles.container}>
          <ActivityIndicator size="large" />
          <Text>Cargando detalles...</Text>
        </SafeAreaView>
      </AuthorizedRoute>
    );
  }

  if (error) {
    return (
      <AuthorizedRoute>
        <SafeAreaView style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </SafeAreaView>
      </AuthorizedRoute>
    );
  }

  return (
    <AuthorizedRoute>
      <SafeAreaView style={styles.container}>
        {deliveryData ? (
          <Card>
            <Card.Title title="Destino de Entrega" titleVariant="titleMedium" />
            <Card.Content>
              <Text variant="bodyLarge" style={styles.addressText}>
                {deliveryData.destination}
              </Text>
            </Card.Content>
          </Card>
        ) : (
          <Text>No se encontraron datos de entrega.</Text>
        )}

        {deliveryData && deliveryData?.route?.status !== 'PENDING' ? (
          <>
            <SimpleButton
              label={isRejecting ? 'Rechazando...' : 'La entrega ya ha sido tomada'}
              accent
              mode="contained"
              onPress={() => handleRejectDelivery()}
              disabled={isAccepting || isRejecting}
              style={styles.rejectButton}
            />
          </>
        ) : (
          <>
            <SimpleButton
              label={isAccepting ? 'Aceptando...' : 'Aceptar entrega'}
              accent
              mode="contained"
              onPress={() => {
                console.log('Accepting delivery...');
                handleAcceptDelivery();
              }}
              disabled={isAccepting || isRejecting}
              style={styles.acceptButton}
            />
            <SimpleButton
              label={isRejecting ? 'Rechazando...' : 'Rechazar entrega'}
              accent
              mode="contained"
              onPress={() => handleRejectDelivery()}
              disabled={isAccepting || isRejecting}
              style={styles.rejectButton}
            />
          </>
        )}
      </SafeAreaView>
    </AuthorizedRoute>
  );
}
