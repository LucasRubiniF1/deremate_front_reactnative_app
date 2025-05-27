import React, { useEffect, useState } from 'react';
import { View, TextInput, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { AuthorizedService } from '../../api/apiClient';
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
      const res = await AuthorizedService.get('/v1/delivery/warehouse');
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
          <TextInput style={styles.input} placeholder="Filtrar por código" value={code} onChangeText={setCode} />
          <TextInput style={styles.input} placeholder="Filtrar por sector" value={sector} onChangeText={setSector} />
          <TextInput style={styles.input} placeholder="Filtrar por estante" value={shelf} onChangeText={setShelf} />

        </View>
      )}
    </AuthorizedRoute>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8, borderRadius: 5 }
});

export default HomeScreen;
