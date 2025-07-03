import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Text,
  Switch,
  Divider,
  List,
  Avatar,
  Button,
  TextInput,
  Checkbox,
  Dialog,
  Portal,
  Paragraph,
} from 'react-native-paper';
import AuthorizedRoute from '../../components/AuthorizedRoute';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from '../../hooks/useRouter';
import { useTheme } from 'react-native-paper';

import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  getToken,
  requestPermission,
  AuthorizationStatus,
  deleteToken, // ✅ agregado
} from '@react-native-firebase/messaging';

import { saveFirebaseDeviceToken } from '../../service/firebase.service';

const messaging = getMessaging(getApp());

const requestUserPermission = async () => {
  if (Platform.OS === 'ios') {
    const authStatus = await requestPermission(messaging);
    return (
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL
    );
  } else if (Platform.OS === 'android') {
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error('Fallo al solicitar permiso en Android', error);
      return false;
    }
  }
  return false;
};

// ✅ nueva función para borrar el token FCM local
const disableNotifications = async () => {
  try {
    await deleteToken(messaging);
    console.log('FCM token eliminado localmente');
    // 🔁 opcional: avisá al backend si querés
  } catch (err) {
    console.warn('Error al eliminar el token FCM:', err);
  }
};

const getStyles = theme => StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: theme.colors.background },
  header: { alignItems: 'center', marginVertical: 20 },
  avatar: { marginBottom: 10 },
  title: {
    fontSize: theme.fonts.headlineMedium.fontSize,
    fontWeight: theme.fonts.headlineMedium.fontWeight,
    color: theme.colors.onBackground,
  },
  subheader: {
    fontSize: theme.fonts.titleSmall.fontSize,
    fontWeight: theme.fonts.titleSmall.fontWeight,
    color: theme.colors.onSurfaceVariant,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: theme.fonts.bodyLarge.fontSize,
    color: theme.colors.onSurface,
  },
  divider: { marginVertical: 12 },
  input: { marginVertical: 10 },
  button: { marginTop: 10, borderRadius: theme.roundness * 2 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  checkboxLabel: {
    fontSize: theme.fonts.bodyLarge.fontSize,
    color: theme.colors.onSurface,
    marginLeft: 8,
  },
  footer: {
    marginVertical: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: theme.fonts.bodySmall.fontSize,
    color: theme.colors.onSurfaceVariant,
  },
});

export default function SettingsScreen() {
  const [isDarkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [email, setEmail] = useState('usuario@email.com');
  const [newsletter, setNewsletter] = useState(false);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  const showDialog = (title, message) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogVisible(true);
  };
  const hideDialog = () => setDialogVisible(false);

  const router = useRouter();
  const theme = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    console.log('[SettingsScreen] Component mounted');
    return () => {
      console.log('[SettingsScreen] Component unmounting');
    };
  }, []);

  const handleDarkModeChange = value => setDarkMode(value);

  const handleNotificationsChange = async value => {
    setNotifications(value);

    if (value) {
      const enabled = await requestUserPermission();
      if (enabled) {
        try {
          const fcmToken = await getToken(messaging);
          await saveFirebaseDeviceToken(fcmToken);
          showDialog('¡Notificaciones Activadas!', 'Ya estás listo para recibir notificaciones.');
        } catch (error) {
          console.error('Error obteniendo el FCM token:', error);
          showDialog('Error', 'No se pudieron activar las notificaciones.');
        }
      } else {
        showDialog('Permiso Denegado', 'No has concedido el permiso para recibir notificaciones.');
      }
    } else {
      await disableNotifications(); // ✅ limpiamos el token local
      showDialog('Notificaciones Desactivadas', 'Ya no recibirás notificaciones.');
    }
  };

  const handleLocationChange = value => setLocationEnabled(value);
  const handleEmailChange = text => setEmail(text);
  const handleNewsletterChange = () => setNewsletter(!newsletter);
  const handlePasswordChange = () => router.push('ChangePassword');

  return (
    <AuthorizedRoute>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <Avatar.Icon size={64} icon="cog-outline" style={styles.avatar} />
            <Text style={styles.title}>Ajustes Generales</Text>
          </View>

          <Divider style={styles.divider} />

          <List.Section>
            <List.Subheader style={styles.subheader}>Preferencias</List.Subheader>

            <View style={styles.item}>
              <Text style={styles.label}>Modo Oscuro</Text>
              <Switch value={isDarkMode} onValueChange={handleDarkModeChange} />
            </View>

            <View style={styles.item}>
              <Text style={styles.label}>Notificaciones</Text>
              <Switch value={notifications} onValueChange={handleNotificationsChange} />
            </View>

            <View style={styles.item}>
              <Text style={styles.label}>Ubicación</Text>
              <Switch value={locationEnabled} onValueChange={handleLocationChange} />
            </View>

            <Divider style={styles.divider} />

            <List.Item title="Privacidad" description="Configuración de permisos y accesos" left={props => <List.Icon {...props} icon="lock-outline" />} />
            <List.Item title="Idioma" description="Español" left={props => <List.Icon {...props} icon="translate" />} />
            <List.Item title="Tema" description="Personalización de la interfaz" left={props => <List.Icon {...props} icon="palette-outline" />} />
          </List.Section>

          <Divider style={styles.divider} />

          <List.Section>
            <List.Subheader style={styles.subheader}>Cuenta</List.Subheader>

            <TextInput
              label="Correo electrónico"
              mode="outlined"
              value={email}
              onChangeText={handleEmailChange}
              style={styles.input}
            />

            <View style={styles.checkboxContainer}>
              <Checkbox status={newsletter ? 'checked' : 'unchecked'} onPress={handleNewsletterChange} />
              <Text style={styles.checkboxLabel}>Suscribirme al newsletter</Text>
            </View>

            <Button icon="lock-reset" mode="contained" style={styles.button} onPress={handlePasswordChange}>
              Cambiar contraseña
            </Button>
          </List.Section>

          <Divider style={styles.divider} />

          <View style={styles.footer}>
            <Icon name="information-outline" size={16} color={theme.colors.onSurfaceVariant} />
            <Text style={styles.footerText}> Versión 1.5.0 - Actualización 09/06/2025</Text>
          </View>
        </ScrollView>

        <Portal>
          <Dialog visible={dialogVisible} onDismiss={hideDialog}>
            <Dialog.Title>{dialogTitle}</Dialog.Title>
            <Dialog.Content>
              <Paragraph>{dialogMessage}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </SafeAreaView>
    </AuthorizedRoute>
  );
}
