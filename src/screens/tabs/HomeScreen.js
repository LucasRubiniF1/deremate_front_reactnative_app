import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { AuthorizedService } from '../../api/apiClient';
import PackageCard from '../../components/PackageCard';
import AuthorizedRoute from '../../components/AuthorizedRoute';

const HomeScreen = () => {
  const [packages, setPackages] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [sector, setSector] = useState('');
  const [shelf, setShelf] = useState('');

  const fetchPackages = async () => {
    try {
      const res = await AuthorizedService.get('/delivery/warehouse');
      setPackages(res.data);
      setFiltered(res.data);
    } catch (err) {
      Alert.alert('Error', 'No se pudieron cargar los paquetes.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    const filteredList = packages.filter(pkg => {
      const matchCode = !code || pkg.id.toString().includes(code);
      const matchSector = !sector || pkg.packageLocation?.toLowerCase().includes(`sector ${sector}`.toLowerCase());
      const matchShelf = !shelf || pkg.packageLocation?.toLowerCase().includes(`estante ${shelf}`.toLowerCase());
      return matchCode && matchSector && matchShelf;
    });
    setFiltered(filteredList);
  }, [code, sector, shelf]);

  return (
    <AuthorizedRoute>
      {loading ? (
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Buscar Paquetes Disponibles</Text>
          <TextInput style={styles.input} placeholder="Buscar por código de paquete" value={code} onChangeText={setCode} />
          <TextInput style={styles.input} placeholder="Seleccionar sector" value={sector} onChangeText={setSector} />
          <TextInput style={styles.input} placeholder="Seleccionar estante" value={shelf} onChangeText={setShelf} />

          <Text style={styles.subtitle}>Paquetes en Depósito</Text>

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <PackageCard pkg={item} />}
          />
        </View>
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
