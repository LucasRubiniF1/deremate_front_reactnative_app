import { useEffect, useState, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { fetchPackagesInWarehouse } from '../service/package.service';
import { notificationService } from '../service/notification.service';

export const useWarehousePackages = () => {
  const [packages, setPackages] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [sector, setSector] = useState('');
  const [shelf, setShelf] = useState('');
  const isInitialized = useRef(false);

  // Initialize notification service
  useEffect(() => {
    const initializeNotifications = async () => {
      if (!isInitialized.current) {
        console.log('[useWarehousePackages] Initializing notifications...');
        await notificationService.initialize((message) => {
          console.log('[useWarehousePackages] New package notification received:', message);
          // Refresh the packages list when a notification is received
          fetch();
        });
        isInitialized.current = true;
      }
    };

    initializeNotifications();

    // Cleanup on unmount
    return () => {
      if (isInitialized.current) {
        notificationService.cleanup();
        isInitialized.current = false;
      }
    };
  }, []);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchPackagesInWarehouse();
      setPackages(data);
      
      // Check for new packages and send notifications
      if (isInitialized.current) {
        notificationService.checkForNewPackages(data);
      }
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
