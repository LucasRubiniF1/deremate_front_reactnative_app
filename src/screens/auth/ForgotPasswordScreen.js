import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { TextInput } from "react-native-paper";
import { SimpleButton } from "../../components/SimpleButton";
import { SimpleSnackbar } from "../../components/SimpleSnackbar";
import { useRouter } from "../../hooks/useRouter";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    // TODO: Implement forgot password logic
    console.log('Reset password for:', email);
    // After successful submission, you might want to navigate to a confirmation screen
    // router.push('Verification');
  };

  return (
    <View style={styles.externalContainer}>
      <View style={styles.container}>
        <Text variant="titleLarge" style={styles.title}>Recuperar contraseña</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Ingresa tu correo electrónico y te enviaremos instrucciones para recuperar tu contraseña.
        </Text>

        <TextInput
          label="Correo"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <SimpleButton
          label="Recuperar contraseña"
          accent
          mode="contained"
          onPress={handleSubmit}
        />

        <SimpleButton
          label="Volver al inicio de sesión"
          accent
          mode="contained"
          onPress={() => router.replace('SignIn')}
        />
      </View>
      <SimpleSnackbar 
        mode="danger" 
        text="Error al enviar el correo de recuperación" 
        closeLabel="OK" 
        setVisible={setVisible} 
        visible={visible} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  externalContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'white',
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  input: {
    marginBottom: 16,
  },
}); 