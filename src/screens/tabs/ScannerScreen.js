import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import {useRouter} from "../../hooks/useRouter";
import AuthorizedRoute from "../../components/AuthorizedRoute";

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
      Alert.alert('Código inválido', 'El código QR escaneado no es un número válido.');
      return;
    }

    setScanned(true);
    router.push('DeliveryDetails', { deliveryId });
  };

  if (hasPermission === null) return <Text>Solicitando permiso para la cámara...</Text>;
  if (hasPermission === false) return <Text>No se concedió permiso a la cámara</Text>;

  return (
    <AuthorizedRoute>
      <View style={styles.container}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={handleBarcodeScanned}
        />

        {scanned && (
          <View style={styles.overlay}>
            <Button title="Escanear de nuevo" onPress={() => setScanned(false)} />
          </View>
        )}
      </View>
    </AuthorizedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
});
