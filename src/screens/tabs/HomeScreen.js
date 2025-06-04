import React, { useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Card } from 'react-native-paper';
import { useWarehousePackages } from '../../hooks/useWarehousePackages';
import PackageCard from '../../components/PackageCard';
import AuthorizedRoute from '../../components/AuthorizedRoute';
import PackageDetailDialog from '../../components/PackageDetailDialog';

const HomeScreen = () => {
  const {
    packages,
    loading,
    code, setCode,
    sector, setSector,
    shelf, setShelf,
    refetch
  } = useWarehousePackages();

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleCodeChange = (text) => {
    if (/^\d*$/.test(text)) setCode(text);
  };

  const handleSectorChange = (text) => {
    if (/^[\w\s]*$/.test(text)) setSector(text);
  };

  const handleShelfChange = (text) => {
    if (/^\d*$/.test(text)) setShelf(text);
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

  return (
    <AuthorizedRoute>
      <SafeAreaView style={styles.container}>
        {loading && !refreshing ? (
          <ActivityIndicator size="large" style={{ flex: 1 }} />
        ) : (
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Buscar Paquetes Disponibles</Text>

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
              label="Seleccionar sector"
              value={sector}
              onChangeText={handleSectorChange}
              style={styles.input}
            />
            <TextInput
              mode="outlined"
              label="Seleccionar estante"
              value={shelf}
              onChangeText={handleShelfChange}
              style={styles.input}
            />

            {renderFiltersSummary()}

            <Text style={styles.subtitle}>Paquetes en Depósito</Text>

            <FlatList
              data={packages}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <PackageCard pkg={item} onPress={() => setSelectedPackage(item)} />
              )}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              contentContainerStyle={{ paddingBottom: 100 }}
            />

            <PackageDetailDialog
              visible={!!selectedPackage}
              onDismiss={() => setSelectedPackage(null)}
              pkg={selectedPackage}
            />
          </View>
        )}
      </SafeAreaView>
    </AuthorizedRoute>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  input: { marginBottom: 12 },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#3F51B5'
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
    color: '#3F51B5'
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#EDE7F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  tagText: {
    fontSize: 14,
    color: '#5E35B1',
    fontWeight: '500',
  },
  filterSummary: {
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#E8EAF6',
    borderRadius: 8
  },
  filterText: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  filterItem: {
    fontSize: 14,
  }
});

export default HomeScreen;
