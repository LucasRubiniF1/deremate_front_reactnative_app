import React, {useState} from 'react';
import { View, StyleSheet, Linking, Platform } from 'react-native';
import { Card, Divider, Text, Button } from 'react-native-paper';
import StatusChip from '../components/StatusChip';
import { useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import PinModal from "./PinModal";

const getStyles = theme =>
  StyleSheet.create({
    card: {
      marginBottom: 16,
      elevation: 2,
      borderRadius: 12,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    statusContainer: {
      backgroundColor: '#3F51B5',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
    },
    statusText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 12,
      textTransform: 'uppercase',
    },
    divider: {
      marginVertical: 8,
    },
    section: {
      marginBottom: 16,
    },
  });

const formatDate = date => {
  if (!date) return 'No disponible';
  const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];
  const d = new Date(date);
  return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()} a las ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

const DeliveryCard = ({ delivery, setSnackbarVisible, setSnackbarMessage, setSnackbarMode }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const [pinModalVisible, setPinModalVisible] = useState(false);

  const openInMaps = () => {
    const { destinationLatitude, destinationLongitude } = delivery.route;

    const getMapsUrl = () => {
      if (Platform.OS === 'ios') {
        return `maps://app?daddr=${destinationLatitude},${destinationLongitude}&dirflg=d`;
      } else {
        return `google.navigation:q=${destinationLatitude},${destinationLongitude}`;
      }
    };

    const url = getMapsUrl();
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Fallback to Google Maps URL if native navigation is not supported
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destinationLatitude},${destinationLongitude}&travelmode=driving`;
        Linking.openURL(googleMapsUrl);
      }
    });
  };

  const finishDelivery = () => {
    console.log("Finishing delivery")
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium">Entrega #{delivery.id}</Text>
          <StatusChip status={delivery.status} styles={styles} />
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text variant="titleSmall">Ubicación del Paquete</Text>
          <Text>{delivery.packageLocation}</Text>
        </View>

        {
          delivery.status === 'NOT_DELIVERED' &&
          <View style={styles.section}>
            <Text variant="titleSmall">Ruta</Text>
            <Text>{delivery.route.description}</Text>
            {delivery.route.destinationLatitude && delivery.route.destinationLongitude && (
              <View>
                <Button
                  mode="contained"
                  onPress={openInMaps}
                  style={{ marginTop: 8 }}
                  icon={({ size, color }) => (
                    <MaterialIcons name="directions" size={size} color={color} />
                  )}
                >
                  Iniciar Navegación
                </Button>

                <Button
                  mode="contained"
                  onPress={() => setPinModalVisible(true)}
                  style={{ marginTop: 8, backgroundColor: "#40ae40" }}
                  icon={({ size, color }) => (
                    <MaterialIcons name="check" size={size} color={color} />
                  )}
                >
                  Finalizar entrega
                </Button>
                <PinModal visible={pinModalVisible} onClose={() => setPinModalVisible(false)} id={delivery.id}
                          setSnackbarMode={setSnackbarMode} setSnackbarVisible={setSnackbarVisible}
                          setSnackbarMessage={setSnackbarMessage}/>
              </View>
            )}
            {delivery.route.completedAt && (
              <Text>Completada: {formatDate(delivery.route.completedAt)}</Text>
            )}
          </View>
        }

        <View style={styles.section}>
          <Text variant="titleSmall">Fechas</Text>
          <Text>Creado: {formatDate(delivery.createdDate)}</Text>
          {delivery.route.startedAt && (
            <Text>Inicio: {formatDate(delivery.route.startedAt)}</Text>
          )}
          {delivery.route.completedAt && (
            <Text>Finalizado: {formatDate(delivery.route.completedAt)}</Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

export default DeliveryCard;
