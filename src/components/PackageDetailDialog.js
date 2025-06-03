import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Dialog, Portal, Text, Button, Chip } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

const getStyles = theme =>
  StyleSheet.create({
    bold: {
      fontWeight: 'bold',
      fontSize: 18,
      color: theme.colors.onSurface,
    },
    chip: {
      alignSelf: 'flex-start',
      marginBottom: 8,
    },
    label: {
      fontSize: 15,
      fontWeight: '600',
      marginTop: 6,
      color: theme.colors.onSurfaceVariant,
    },
    value: {
      fontWeight: '400',
      color: theme.colors.onSurface,
    },
    statusContainer: {
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: theme.roundness * 1.5,
      marginBottom: 10,
    },
    statusText: {
      fontWeight: 'bold',
      fontSize: 14,
    },

    chipText: {
      color: theme.colors.onPrimary,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      fontSize: 12,
    },
  });

const PackageDetailDialog = ({ visible, onDismiss, pkg }) => {
  if (!pkg) return null;

  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>
          <Text style={styles.bold}>Detalle del Paquete #{pkg.id}</Text>
        </Dialog.Title>
        <Dialog.Content>
          <Chip icon="archive" style={styles.chip}>
            Código: {pkg.id}
          </Chip>

          <Chip style={styles.chip}>{pkg.status}</Chip>

          <Text style={styles.label}>
            Ubicación: <Text style={styles.value}>{pkg.packageLocation}</Text>
          </Text>

          <Text style={styles.label}>
            Creado: <Text style={styles.value}>{new Date(pkg.createdDate).toLocaleString()}</Text>
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} mode="contained-tonal">
            Cerrar
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default PackageDetailDialog;
