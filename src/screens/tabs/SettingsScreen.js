import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, Switch, Divider, List, Avatar, Button, TextInput, Checkbox } from "react-native-paper";
import AuthorizedRoute from "../../components/AuthorizedRoute";

export default function SettingsScreen() {
  const [isDarkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [email, setEmail] = useState("usuario@email.com");
  const [newsletter, setNewsletter] = useState(false);

  return (
    <AuthorizedRoute>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Avatar.Icon size={64} icon="cog-outline" style={styles.avatar} />
          <Text style={styles.title}>Ajustes Generales</Text>
        </View>

        <Divider style={styles.divider} />

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
            left={(props) => <List.Icon {...props} icon="lock" />}
          />
          <List.Item
            title="Idioma"
            description="Español"
            left={(props) => <List.Icon {...props} icon="translate" />}
          />
          <List.Item
            title="Tema"
            description="Personalización de la interfaz"
            left={(props) => <List.Icon {...props} icon="palette" />}
          />
        </List.Section>

        <Divider style={styles.divider} />

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

          <Button mode="contained-tonal" style={styles.button}>
            Cambiar contraseña
          </Button>

        </List.Section>

        <Divider style={styles.divider} />

        <Text style={styles.footerText}>Versión 1.4.2 - Última actualización 27/05/2025</Text>
      </ScrollView>
    </AuthorizedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
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
    backgroundColor: "#333",
  },
  input: {
    marginVertical: 10,
  },
  button: {
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  checkboxLabel: {
    fontSize: 15,
  },
  footerText: {
    marginTop: 20,
    fontSize: 12,
    textAlign: "center",
  },
});



























































































































