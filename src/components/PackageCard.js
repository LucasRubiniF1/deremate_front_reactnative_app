import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Card, Avatar, Chip } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

const getStyles = theme =>
  StyleSheet.create({
    pressable: {
      marginBottom: 12,
      borderRadius: theme.roundness * 3,
    },
    pressed: {
      opacity: 0.85,
    },
    card: {
      borderRadius: theme.roundness * 3,
      elevation: 2,

      backgroundColor: theme.colors.surfaceVariant,
      padding: 10,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      backgroundColor: theme.colors.surfaceVariant,
      marginRight: 12,
      padding: 8,
      borderRadius: theme.roundness * 5,
    },
    details: {
      flex: 1,
    },
    title: {
      fontSize: 15,
      marginBottom: 4,
      color: theme.colors.onSurface,
    },
    bold: {
      fontWeight: 'bold',
    },
    text: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
    },
    chip: {
      alignSelf: 'flex-start',
      marginTop: 6,
      backgroundColor: theme.colors.primary,
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: theme.roundness * 2,
    },
    chipText: {
      color: theme.colors.onPrimary,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      fontSize: 12,
    },
  });

const PackageCard = ({ pkg, onPress }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <Pressable
      onPress={() => onPress(pkg)}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <Card style={styles.card} mode="elevated">
        <View style={styles.row}>
          <Avatar.Icon icon="archive-outline" size={36} style={styles.icon} />
          <View style={styles.details}>
            <Text style={styles.title}>
              Código: <Text style={styles.bold}>{pkg.id}</Text>
            </Text>
            <Text style={styles.text}>Ubicación en Depósito: {pkg.packageLocation}</Text>
            <Chip style={styles.chip} textStyle={styles.chipText}>
              {pkg.status}
            </Chip>
          </View>
        </View>
      </Card>
    </Pressable>
  );
};

export default PackageCard;
