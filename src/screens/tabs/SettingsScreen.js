import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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
} from 'react-native-paper';
import AuthorizedRoute from '../../components/AuthorizedRoute';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from '../../hooks/useRouter';
import { useTheme } from 'react-native-paper';

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.background, // Usar color de fondo del tema
    },
    header: {
      alignItems: 'center',
      marginVertical: 20,
    },
    avatar: {
      // Estilo de layout para Avatar.Icon
      marginBottom: 10,
      // Avatar.Icon de Paper usará colores del tema por defecto
      // (ej. theme.colors.secondaryContainer para el fondo y theme.colors.onSecondaryContainer para el ícono)
      // o puedes personalizarlo con props si es necesario.
    },
    title: {
      // Considera usar <Text variant="headlineMedium"> o <Text variant="titleLarge">
      fontSize: theme.fonts.headlineMedium.fontSize, // Ejemplo de uso de fuentes del tema
      fontWeight: theme.fonts.headlineMedium.fontWeight,
      color: theme.colors.onBackground, // Color de texto sobre el fondo
    },
    subheader: {
      // List.Subheader de Paper ya tiene estilos temáticos.
      // Si necesitas anular:
      fontSize: theme.fonts.titleSmall.fontSize, // Ejemplo
      fontWeight: theme.fonts.titleSmall.fontWeight,
      color: theme.colors.onSurfaceVariant, // Color para subcabeceras
    },
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12, // Puedes ajustar o eliminar si List.Item se encarga bien
    },
    label: {
      fontSize: theme.fonts.bodyLarge.fontSize, // Ejemplo
      color: theme.colors.onSurface, // Texto principal en items
    },
    divider: {
      marginVertical: 12,
      // backgroundColor: '#ddd', // ELIMINADO - Divider de Paper usa theme.colors.outlineVariant
    },
    input: {
      // Estilo de layout para TextInput
      marginVertical: 10,
    },
    button: {
      // Estilo de layout/forma para Button
      marginTop: 10,
      borderRadius: theme.roundness * 2, // Consistente con Paper
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    checkboxLabel: {
      fontSize: theme.fonts.bodyLarge.fontSize, // Ejemplo
      color: theme.colors.onSurface,
      marginLeft: 8, // Espacio entre Checkbox y Label
    },
    footer: {
      marginVertical: 24,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    footerText: {
      fontSize: theme.fonts.bodySmall.fontSize, // Ejemplo
      color: theme.colors.onSurfaceVariant, // Texto de pie de página, menos prominente
    },
  });

export default function SettingsScreen() {
  const [isDarkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [email, setEmail] = useState('usuario@email.com');
  const [newsletter, setNewsletter] = useState(false);

  const router = useRouter();

  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <AuthorizedRoute>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <Avatar.Icon size={64} icon="cog-outline" style={styles.avatar} />
            <Text style={styles.title}>Ajustes Generales</Text>
          </View>

          <Divider style={styles.divider} />

          {/* Preferencias */}
          <List.Section>
            <List.Subheader style={styles.subheader}>Preferencias</List.Subheader>

            <View style={styles.item}>
              <Text style={styles.label}>Modo Oscuro</Text>
              <Switch value={isDarkMode} onValueChange={setDarkMode} />
            </View>

            <View style={styles.item}>
              <Text style={styles.label}>Notificaciones</Text>
              <Switch value={notifications} onValueChange={setNotifications} />
            </View>

            <View style={styles.item}>
              <Text style={styles.label}>Ubicación</Text>
              <Switch value={locationEnabled} onValueChange={setLocationEnabled} />
            </View>

            <Divider style={styles.divider} />

            <List.Item
              title="Privacidad"
              description="Configuración de permisos y accesos"
              left={props => <List.Icon {...props} icon="lock-outline" />}
            />
            <List.Item
              title="Idioma"
              description="Español"
              left={props => <List.Icon {...props} icon="translate" />}
            />
            <List.Item
              title="Tema"
              description="Personalización de la interfaz"
              left={props => <List.Icon {...props} icon="palette-outline" />}
            />
          </List.Section>

          <Divider style={styles.divider} />

          {/* Cuenta */}
          <List.Section>
            <List.Subheader style={styles.subheader}>Cuenta</List.Subheader>

            <TextInput
              label="Correo electrónico"
              mode="outlined"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />

            <View style={styles.checkboxContainer}>
              <Checkbox
                status={newsletter ? 'checked' : 'unchecked'}
                onPress={() => setNewsletter(!newsletter)}
              />
              <Text style={styles.checkboxLabel}>Suscribirme al newsletter</Text>
            </View>

            <Button
              icon="lock-reset"
              mode="contained"
              style={styles.button}
              onPress={() => router.push('ChangePassword')}
            >
              Cambiar contraseña
            </Button>
          </List.Section>

          <Divider style={styles.divider} />

          <View style={styles.footer}>
            <Icon name="information-outline" size={16} color={theme.colors.onSurfaceVariant} />
            <Text style={styles.footerText}> Versión 1.4.2 - Actualización 27/05/2025</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AuthorizedRoute>
  );
}
