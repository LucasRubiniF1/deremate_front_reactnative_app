import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { CameraView, Camera } from 'expo-camera';
import { Button, ActivityIndicator } from 'react-native-paper';
import { useRouter } from '../../hooks/useRouter';

import AuthorizedRoute from '../../components/AuthorizedRoute';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScannerScreen() {
  console.log('[ScannerScreen] Component mounted');
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(true);
  const cameraRef = useRef(null);
  const router = useRouter();
  const isFocused = useIsFocused();

  useEffect(() => {
    console.log('[ScannerScreen] Requesting camera permissions...');
    (async () => {
      try {
        setLoading(true);
        const { status } = await Camera.requestCameraPermissionsAsync();
        console.log('[ScannerScreen] Camera permission status:', status);
        setHasPermission(status === 'granted');
      } catch (error) {
        console.error('[ScannerScreen] Error requesting camera permissions:', error);
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      console.log('[ScannerScreen] Component unmounting');
    };
  }, []);

  useEffect(() => {
    console.log('[ScannerScreen] Camera focus state changed:', { isFocused });
  }, [isFocused]);

  const handleBarcodeScanned = ({ data }) => {
    console.log('[ScannerScreen] Barcode scanned:', data);
    if (scanned) {
      console.log('[ScannerScreen] Already scanned, ignoring new scan');
      return;
    }

    const deliveryId = parseInt(data, 10);
    if (isNaN(deliveryId)) {
      console.log('[ScannerScreen] Invalid QR code: not a valid number');
      alert('Código inválido: El código QR escaneado no es un número válido.');
      return;
    }

    console.log('[ScannerScreen] Valid QR code scanned, navigating to delivery:', deliveryId);
    setScanned(true);
    router.push('NavigateToDelivery', { deliveryId });
  };

  if (loading) {
    console.log('[ScannerScreen] Rendering loading state');
    return (
      <AuthorizedRoute>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Cargando cámara...</Text>
          </View>
        </SafeAreaView>
      </AuthorizedRoute>
    );
  }

  if (hasPermission === false) {
    console.log('[ScannerScreen] Rendering permission denied state');
    return (
      <AuthorizedRoute>
        <SafeAreaView style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              No se puede acceder a la cámara. Por favor, permite el acceso en la configuración.
            </Text>
            <Button
              mode="contained"
              onPress={async () => {
                console.log('[ScannerScreen] Requesting camera permissions again');
                const { status } = await Camera.requestCameraPermissionsAsync();
                console.log('[ScannerScreen] New camera permission status:', status);
                setHasPermission(status === 'granted');
              }}
            >
              Solicitar permisos de nuevo
            </Button>
          </View>
        </SafeAreaView>
      </AuthorizedRoute>
    );
  }

  console.log('[ScannerScreen] Rendering camera view:', {
    hasPermission,
    isFocused,
    scanned,
  });

  return (
    <AuthorizedRoute>
      <SafeAreaView style={styles.container}>
        {hasPermission && isFocused ? (
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFillObject}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          />
        ) : (
          <View style={styles.inactiveContainer}>
            <Text style={styles.inactiveText}>
              {!isFocused ? 'Cámara pausada' : 'Activando cámara...'}
            </Text>
          </View>
        )}

        {scanned && (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>¡QR escaneado!</Text>
            <Button
              mode="contained"
              onPress={() => {
                console.log('[ScannerScreen] Resetting scan state');
                setScanned(false);
              }}
              style={styles.scanAgainButton}
            >
              Escanear de nuevo
            </Button>
          </View>
        )}

        {!scanned && hasPermission && isFocused && (
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>Apunta la cámara hacia el código QR</Text>
          </View>
        )}
      </SafeAreaView>
    </AuthorizedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingText: {
    color: 'white',
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 20,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  inactiveContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  inactiveText: {
    color: 'white',
    fontSize: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  overlayText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  scanAgainButton: {
    marginTop: 10,
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionsText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 8,
  },
});
