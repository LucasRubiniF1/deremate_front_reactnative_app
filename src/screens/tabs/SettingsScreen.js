import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text, Switch, Divider, List, Avatar, Button, TextInput, Checkbox
} from "react-native-paper";
import AuthorizedRoute from "../../components/AuthorizedRoute";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "../../hooks/useRouter";

export default function SettingsScreen() {
  const [isDarkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [email, setEmail] = useState("usuario@email.com");
  const [newsletter, setNewsletter] = useState(false);

  const router = useRouter();

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
              left={(props) => <List.Icon {...props} icon="lock-outline" />}
            />
            <List.Item
              title="Idioma"
              description="Español"
              left={(props) => <List.Icon {...props} icon="translate" />}
            />
            <List.Item
              title="Tema"
              description="Personalización de la interfaz"
              left={(props) => <List.Icon {...props} icon="palette-outline" />}
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
                status={newsletter ? "checked" : "unchecked"}
                onPress={() => setNewsletter(!newsletter)}
              />
              <Text style={styles.checkboxLabel}>Suscribirme al newsletter</Text>
            </View>

            <Button
              icon="lock-reset"
              mode="contained"
              style={styles.button}
              onPress={() => router.push('ChangePassword')} // ← crear pantalla si la vas a usar
            >
              Cambiar contraseña
            </Button>
          </List.Section>

          <Divider style={styles.divider} />

          {/* Footer visual */}
          <View style={styles.footer}>
            <Icon name="information-outline" size={16} color="#888" />
            <Text style={styles.footerText}>  Versión 1.4.2 - Actualización 27/05/2025</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AuthorizedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subheader: {
    fontSize: 14,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
  },
  divider: {
    marginVertical: 12,
    backgroundColor: "#ddd",
  },
  input: {
    marginVertical: 10,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  checkboxLabel: {
    fontSize: 15,
  },
  footer: {
    marginVertical: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
  },
});
