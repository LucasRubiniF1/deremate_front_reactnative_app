import { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { fetchPackagesInWarehouse } from '../service/package.service';

export const useWarehousePackages = () => {
  const [packages, setPackages] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [sector, setSector] = useState('');
  const [shelf, setShelf] = useState('');

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchPackagesInWarehouse();
      setPackages(data);
    } catch (err) {
      Alert.alert('Error', 'No se pudieron cargar los paquetes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    const filteredList = packages.filter(pkg => {
      const matchCode = !code || pkg.id.toString().includes(code);
      const matchSector =
        !sector || pkg.packageLocation?.toLowerCase().includes(`sector ${sector}`.toLowerCase());
      const matchShelf =
        !shelf || pkg.packageLocation?.toLowerCase().includes(`estante ${shelf}`.toLowerCase());
      return matchCode && matchSector && matchShelf;
    });

    setFiltered(filteredList);
  }, [code, sector, shelf, packages]);

  return {
    packages: filtered,
    loading,
    code,
    setCode,
    sector,
    setSector,
    shelf,
    setShelf,
    refetch: fetch, // ✅ Esta es la función que vas a usar para el Refresh
  };
};
