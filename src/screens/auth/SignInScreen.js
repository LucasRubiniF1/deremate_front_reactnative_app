import { useEffect, useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import { useRouter } from "../../hooks/useRouter";
import { Text } from "react-native-paper";
import { TextInput } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { SimpleButton } from "../../components/SimpleButton";
import { SimpleSnackbar } from "../../components/SimpleSnackbar";

export default function SignInScreen() {
  const { login, isAuthenticated, error, setEmailVerified } = useAuthStore();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Cleanup function
  const cleanupErrors = () => {
    setVisible(false);
    setErrorMessage('');
  };

  // Reset state when component mounts
  useEffect(() => {
    cleanupErrors();
    setEmail('');
    setPassword('');
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      cleanupErrors();
      router.replace('BiometricAuth');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error === 'Account is already verified') {
      // If account is already verified, proceed with login
      login(email, password);
    } else if (error) {
      setErrorMessage(error);
      setVisible(true);
    }
  }, [error]);

  const handleLogin = async () => {
    cleanupErrors();

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Debes ingresar tu correo y contraseña.");
      setVisible(true);
      return;
    }

    const result = await login(email, password);
    if (result === 'EMAIL_NOT_VERIFIED') {
      setEmailVerified({
        email,
        password,
        verified: false
      });
      router.push('Verification');
    }
  };

  return (
    <View style={styles.externalContainer}>
      <View style={styles.container}>
        <Text variant="titleLarge" style={styles.title}>Iniciar sesión</Text>

        <TextInput
          label="Correo"
          value={email}
          onChangeText={(text) => {
            cleanupErrors();
            setEmail(text);
          }}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={(text) => {
            cleanupErrors();
            setPassword(text);
          }}
          secureTextEntry
          style={styles.input}
          mode="outlined"
        />

        <SimpleButton
          label="Ingresar"
          accent mode="contained"
          onPress={handleLogin} />

        <SimpleButton
          label="Crear una cuenta"
          accent mode="contained"
          onPress={() => {
            cleanupErrors();
            router.push('SignUp');
          }} />

        <SimpleButton
          label="Olvidé mi contraseña"
          accent mode="contained"
          onPress={() => {
            cleanupErrors();
            router.push('ForgotPassword');
          }} />
      </View>
      <SimpleSnackbar
        mode="danger"
        text={errorMessage}
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
    marginBottom: 24,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginVertical: 6,
    borderRadius: 8,
    backgroundColor: '#7C61CB',
  },
});
