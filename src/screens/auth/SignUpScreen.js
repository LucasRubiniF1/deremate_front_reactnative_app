import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { SimpleButton } from "../../components/SimpleButton";
import { useRouter } from "../../hooks/useRouter";
import { SimpleSnackbar } from "../../components/SimpleSnackbar";
import {
  validateEmail,
  validateName,
  validatePasswordsMatch,
  validatePasswordStrength
} from "../../utils/validators";
import useAuthStore from "../../store/useAuthStore";

export default function SignUpScreen() {
  const { signUp, loading, error, isUserCreated } = useAuthStore();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarMode, setSnackbarMode] = useState('');

  const handleSignUp = () => {
    const validations = [
      validateName(firstName),
      validateName(lastName, false),
      validateEmail(email),
      validatePasswordStrength(password),
      validatePasswordsMatch(password, confirmPassword),
    ];

    const errors = validations.filter(Boolean);

    if (errors.length) {
      setSnackbarMode('danger')
      setSnackbarMessage(errors.join('\n'));
      setVisible(true);
      return;
    }

    signUp(email, password, firstName, lastName);
  };

  useEffect(() => {
    if (error) {
      setSnackbarMode('danger')
      setSnackbarMessage(error);
      setVisible(true);
    }
  }, [error]);

  useEffect(() => {
    if (isUserCreated) {
      setSnackbarMode('success');
      setSnackbarMessage('Cuenta creada exitosamente. Redirigiendo...');
      setVisible(true);

      const timeout = setTimeout(() => {
        useAuthStore.setState({ isUserCreated: null });
        router.replace('SignIn');
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [isUserCreated]);

  return (
    <View style={styles.externalContainer}>
      <View style={styles.container}>
        <Text variant="titleLarge" style={styles.title}>Crear cuenta</Text>

        <TextInput
          label="Correo"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
          disabled={loading}
        />

        <TextInput
          label="Nombre"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
          mode="outlined"
          disabled={loading}
        />

        <TextInput
          label="Apellido"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
          mode="outlined"
          disabled={loading}
        />

        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
          disabled={loading}
        />

        <TextInput
          label="Confirmar contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
          disabled={loading}
        />

        <SimpleButton
          label="Registrarse"
          accent mode="contained"
          onPress={handleSignUp}
          disabled={loading}
        />

        <SimpleButton
          label="Ya tengo cuenta"
          accent mode="contained"
          onPress={() => router.replace('SignIn')}
          disabled={loading}
        />
      </View>
      <SimpleSnackbar mode={snackbarMode} text={snackbarMessage} closeLabel="OK" setVisible={setVisible} visible={visible} />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  container: {
    marginHorizontal: 24,
    marginVertical: 64,
    paddingVertical: 32,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  title: {
    textAlign: 'center',
    marginBottom: 28,
    color: "#333",
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
  },
  secondaryButton: {
    marginTop: 8,
    borderRadius: 8,
  },
});



























































