import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { Button, ActivityIndicator } from 'react-native-paper';
import { useRouter } from '../../hooks/useRouter';
import AuthorizedRoute from '../../components/AuthorizedRoute';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarcodeScanned = ({ data }) => {
    if (scanned) return;

    const deliveryId = parseInt(data, 10);
    if (isNaN(deliveryId)) {
      alert('Código inválido: El código QR escaneado no es un número válido.');
      return;
    }

    setScanned(true);
    router.push('DeliveryDetails', { deliveryId });
  };

  if (hasPermission === null) {
    return (
      <AuthorizedRoute>
        <SafeAreaView style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text style={styles.info}>Solicitando permiso para la cámara...</Text>
        </SafeAreaView>
      </AuthorizedRoute>
    );
  }

  if (hasPermission === false) {
    return (
      <AuthorizedRoute>
        <SafeAreaView style={styles.centered}>
          <Text style={styles.error}>Permiso denegado para acceder a la cámara.</Text>
        </SafeAreaView>
      </AuthorizedRoute>
    );
  }

  return (
    <AuthorizedRoute>
      <SafeAreaView style={styles.container}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={handleBarcodeScanned}
        />

        {scanned && (
          <View style={styles.overlay}>
            <Button mode="contained" onPress={() => setScanned(false)}>
              Escanear de nuevo
            </Button>
          </View>
        )}
      </SafeAreaView>
    </AuthorizedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  info: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
  },
  error: {
    fontSize: 16,
    color: '#D32F2F',
  },
});
