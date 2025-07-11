import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, RefreshControl, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Card } from 'react-native-paper';
import { useWarehousePackages } from '../../hooks/useWarehousePackages';
import PackageCard from '../../components/PackageCard';
import AuthorizedRoute from '../../components/AuthorizedRoute';
import PackageDetailDialog from '../../components/PackageDetailDialog';
import NotificationBadge from '../../components/NotificationBadge';
import { useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useNotificationClose } from '../../hooks/useNotificationClose';
import { useFocusEffect } from '@react-navigation/native';

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    input: {
      marginBottom: 12,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
      color: theme.colors.primary,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 16,
      textAlign: 'center',
      color: theme.colors.primary,
    },
    tagsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 12,
      marginBottom: 12,
    },
    tag: {
      backgroundColor: theme.colors.secondaryContainer,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 4,
    },
    tagText: {
      fontSize: 14,
      color: theme.colors.onSecondaryContainer,
      fontWeight: '500',
    },
    filterSummary: {
      padding: 12,
      marginBottom: 16,
      backgroundColor: theme.colors.primaryContainer,
      borderRadius: theme.roundness * 2,
    },
    filterText: {
      fontWeight: 'bold',
      marginBottom: 4,
      color: theme.colors.onPrimaryContainer,
    },
    filterItem: {
      fontSize: 14,
      color: theme.colors.onPrimaryContainer,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
      marginTop: 12,
    },
    emptyIcon: {
      marginBottom: 12,
    },
    titleContainer: {
      position: 'relative',
      alignItems: 'center',
    },
  });

const HomeScreen = () => {
  const { packages, loading, code, setCode, sector, setSector, shelf, setShelf, refetch } =
    useWarehousePackages();

  const theme = useTheme();
  const styles = getStyles(theme);

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [newPackageCount, setNewPackageCount] = useState(0);

  // Refetch cuando se entra a esta pantalla
  useFocusEffect(
    useCallback(() => {
      console.log('[HomeScreen] useFocusEffect - refetch triggered');
      refetch();
    }, [refetch])
  );

  useNotificationClose(() => {
    console.log('[HomeScreen] Notification was closed - refreshing packages...');
    refetch();
  }, [refetch]);

  useNotificationClose((notificationData) => {
    if (notificationData?.data?.action === 'refresh_packages') {
      refetch();
    }
  }, [refetch], { includeData: true });

  useEffect(() => {
    console.log('[HomeScreen] Initial packages loaded:', packages?.length || 0);
    return () => {
      console.log('[HomeScreen] Component unmounting');
    };
  }, [packages]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
    setNewPackageCount(0);
  };

  const handleCodeChange = text => {
    if (/^\d*$/.test(text)) {
      setCode(text);
    }
  };

  const handleSectorChange = text => {
    if (/^[A-Za-z]*$/.test(text)) {
      setSector(text);
    }
  };

  const handleShelfChange = text => {
    if (/^\d*$/.test(text)) {
      setShelf(text);
    }
  };

  const renderFiltersSummary = () => {
    if (!code && !sector && !shelf) return null;
    return (
      <Card style={styles.filterSummary}>
        <Text style={styles.filterText}>🔍 Buscando:</Text>
        {code ? <Text style={styles.filterItem}>• Código: {code}</Text> : null}
        {sector ? <Text style={styles.filterItem}>• Sector: {sector}</Text> : null}
        {shelf ? <Text style={styles.filterItem}>• Estante: {shelf}</Text> : null}
      </Card>
    );
  };

  const renderEmptyComponent = () => {
    const hasFilters = code || sector || shelf;
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons
          name={hasFilters ? "search-off" : "inventory"}
          size={48}
          color={theme.colors.onSurfaceVariant}
          style={styles.emptyIcon}
        />
        <Text style={styles.emptyText}>
          {hasFilters
            ? "No se encontraron paquetes con los filtros seleccionados"
            : "No hay paquetes disponibles en el depósito"}
        </Text>
      </View>
    );
  };

  if (loading && !refreshing) {
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
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Buscar Paquetes Disponibles</Text>
              <NotificationBadge count={newPackageCount} />
            </View>

            <View style={styles.tagsContainer}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>🏛️ Sector: {sector || 'Todos'}</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>📚 Estante: {shelf || 'Todos'}</Text>
              </View>
            </View>

            <TextInput
              mode="outlined"
              label="Buscar por código de paquete"
              value={code}
              onChangeText={handleCodeChange}
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label="Buscar por sector"
              value={sector}
              onChangeText={handleSectorChange}
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label="Buscar por estante"
              value={shelf}
              onChangeText={handleShelfChange}
              style={styles.input}
            />

            {renderFiltersSummary()}

            <Text style={styles.subtitle}>Paquetes en Depósito</Text>

            <FlatList
              data={packages}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <PackageCard
                  pkg={item}
                  onPress={() => setSelectedPackage(item)}
                />
              )}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
              ListEmptyComponent={renderEmptyComponent}
            />

            <PackageDetailDialog
              visible={!!selectedPackage}
              onDismiss={() => setSelectedPackage(null)}
              pkg={selectedPackage}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthorizedRoute>
  );
};

export default HomeScreen;
