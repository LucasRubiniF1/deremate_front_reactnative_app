import React, { useEffect, useState, useMemo } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { ActivityIndicator, TextInput, Text, Chip } from 'react-native-paper';
import AuthorizedRoute from '../../components/AuthorizedRoute';
import PackageCard from '../../components/PackageCard';
import { fetchPackagesInWarehouse } from '../../service/package.service';

const usePackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackagesInWarehouse()
      .then((data) => setPackages(data))
      .catch((err) => {
        Alert.alert('Error', 'No se pudieron cargar los paquetes.');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { packages, loading };
};

const HomeScreen = () => {
  const { packages, loading } = usePackages();

  const [code, setCode] = useState('');
  const [sector, setSector] = useState('');
  const [shelf, setShelf] = useState('');

  const filtered = useMemo(() => {
    return packages.filter(pkg => {
      const matchCode = !code || pkg.id.toString().includes(code);
      const matchSector = !sector || pkg.packageLocation?.toLowerCase().includes(`sector ${sector}`.toLowerCase());
      const matchShelf = !shelf || pkg.packageLocation?.toLowerCase().includes(`estante ${shelf}`.toLowerCase());
      return matchCode && matchSector && matchShelf;
    });
  }, [code, sector, shelf, packages]);

  return (
    <AuthorizedRoute>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>Buscar Paquetes Disponibles</Text>

        <TextInput
          mode="outlined"
          label="Código del paquete"
          value={code}
          onChangeText={setCode}
          style={styles.input}
        />

        <View style={styles.chipsContainer}>
          <Chip icon="warehouse">Sector: {sector || 'Todos'}</Chip>
          <Chip icon="bookshelf">Estante: {shelf || 'Todos'}</Chip>
        </View>

        <TextInput
          mode="outlined"
          label="Sector"
          value={sector}
          onChangeText={setSector}
          style={styles.input}
        />

        <TextInput
          mode="outlined"
          label="Estante"
          value={shelf}
          onChangeText={setShelf}
          style={styles.input}
        />

        <Text variant="titleMedium" style={styles.subtitle}>Paquetes en Depósito</Text>

        {loading ? (
          <ActivityIndicator animating={true} size="large" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <PackageCard pkg={item} />}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </AuthorizedRoute>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#3F51B5',
  },
  subtitle: {
    textAlign: 'center',
    marginVertical: 12,
    color: '#3F51B5',
  },
  input: {
    marginVertical: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
});

export default HomeScreen;
