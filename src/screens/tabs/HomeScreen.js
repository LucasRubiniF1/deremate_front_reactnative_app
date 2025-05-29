import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    shelf, setShelf
  } = useWarehousePackages();

  const [selectedPackage, setSelectedPackage] = useState(null);

  return (
    <AuthorizedRoute>
      {loading ? (
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      ) : (
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>Buscar Paquetes Disponibles</Text>
          <TextInput
            style={styles.input}
            placeholder="Buscar por código de paquete"
            value={code}
            onChangeText={setCode}
          />
          <TextInput
            style={styles.input}
            placeholder="Seleccionar sector"
            value={sector}
            onChangeText={setSector}
          />
          <TextInput
            style={styles.input}
            placeholder="Seleccionar estante"
            value={shelf}
            onChangeText={setShelf}
          />

          <Text style={styles.subtitle}>Paquetes en Depósito</Text>

          <FlatList
            data={packages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <PackageCard pkg={item} onPress={() => setSelectedPackage(item)} />
            )}
          />

          <PackageDetailDialog
            visible={!!selectedPackage}
            onDismiss={() => setSelectedPackage(null)}
            pkg={selectedPackage}
          />
        </SafeAreaView>
      )}
    </AuthorizedRoute>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 16
  },
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
    marginVertical: 12,
    textAlign: 'center',
    color: '#3F51B5'
  }
});

export default HomeScreen;
