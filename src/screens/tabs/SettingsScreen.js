import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
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
import { useNotifications } from '../../hooks/useNotifications';

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

  const { enableNotifications, disableNotifications } = useNotifications();

  const handleDarkModeChange = value => setDarkMode(value);

  const handleNotificationsChange = async value => {
    if (value) {
      const ok = await enableNotifications();
      if (ok) {
        setNotifications(true);
        showDialog('¡Notificaciones Activadas!', 'Ya estás listo para recibir notificaciones.');
      } else {
        showDialog('Error', 'No se pudieron activar las notificaciones.');
      }
    } else {
      const ok = await disableNotifications();
      if (ok) {
        setNotifications(false);
        showDialog('Notificaciones Desactivadas', 'Ya no recibirás notificaciones.');
      } else {
        showDialog('Error', 'No se pudieron desactivar las notificaciones.');
      }
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

            <Button
              icon="lock-reset"
              mode="contained"
              style={styles.button}
              onPress={handlePasswordChange}
              disabled
            >
              Cambiar contraseña
            </Button>

          </List.Section>

          <Divider style={styles.divider} />

          <View style={styles.footer}>
            <Icon name="information-outline" size={16} color={theme.colors.onSurfaceVariant} />
            <Text style={styles.footerText}> Versión 3.0.0 - Actualización 07/07/2025</Text>
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
