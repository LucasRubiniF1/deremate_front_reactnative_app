import { useState, useEffect, useRef } from 'react';
import { schedulePushNotification } from '../service/notificationService';
import { getToken } from '../utils/secureStore';
import axios from 'axios';
import { AppState } from 'react-native';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const POLLING_INTERVAL = 30000; // Check every 30 seconds

export function useWarehousePackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [sector, setSector] = useState('');
  const [shelf, setShelf] = useState('');
  const [lastPackageId, setLastPackageId] = useState(null);
  const pollingIntervalRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);

  const fetchPackages = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`${BASE_URL}/packages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          code: code || undefined,
          sector: sector || undefined,
          shelf: shelf || undefined,
        },
      });

      const newPackages = response.data;
      setPackages(newPackages);

      // Check for new packages
      if (lastPackageId && newPackages.length > 0) {
        const latestPackage = newPackages[0];
        if (latestPackage.id > lastPackageId) {
          await schedulePushNotification(
            '¡Nuevo paquete disponible!',
            `Se ha agregado un nuevo paquete al depósito: ${latestPackage.code}`,
            { packageId: latestPackage.id }
          );
        }
      }

      if (newPackages.length > 0) {
        setLastPackageId(newPackages[0].id);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Start polling when component mounts
  useEffect(() => {
    const startPolling = () => {
      // Clear any existing interval
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      
      // Start new polling interval
      pollingIntervalRef.current = setInterval(fetchPackages, POLLING_INTERVAL);
    };

    // Handle app state changes
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App came to foreground
        startPolling();
      } else if (nextAppState.match(/inactive|background/)) {
        // App went to background
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      }
      appStateRef.current = nextAppState;
    });

    // Initial fetch and start polling
    fetchPackages();
    startPolling();

    // Cleanup
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      subscription.remove();
    };
  }, [code, sector, shelf]); // Re-run when filters change

  return {
    packages,
    loading,
    code,
    setCode,
    sector,
    setSector,
    shelf,
    setShelf,
    refetch: fetchPackages,
  };
}
