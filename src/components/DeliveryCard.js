import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Divider, Text, Chip } from 'react-native-paper';

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

const DeliveryCard = ({ delivery }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium">Entrega #{delivery.id}</Text>
          <Chip style={styles.chip} textStyle={styles.chipText}>
            {delivery.status}
          </Chip>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text variant="titleSmall">Ubicación del Paquete</Text>
          <Text>{delivery.packageLocation}</Text>
        </View>

        <View style={styles.section}>
          <Text variant="titleSmall">Ruta</Text>
          <Text>Origen: {delivery.route.origin}</Text>
          <Text>Destino: {delivery.route.destination}</Text>
          {delivery.route.completedAt && (
            <Text>Completada: {formatDate(delivery.route.completedAt)}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text variant="titleSmall">Fechas</Text>
          <Text>Creado: {formatDate(delivery.createdDate)}</Text>
          {delivery.deliveryStartDate && (
            <Text>Inicio: {formatDate(delivery.deliveryStartDate)}</Text>
          )}
          {delivery.deliveryEndDate && (
            <Text>Finalizado: {formatDate(delivery.deliveryEndDate)}</Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
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

export default DeliveryCard;
