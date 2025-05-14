import {useEffect, useState} from "react";
import useAuthStore from "../../store/useAuthStore";
import {useRouter} from "../../hooks/useRouter";
import {PaperProvider, Text} from "react-native-paper";
import {TextInput} from "react-native-paper";
import {StyleSheet, View} from "react-native";
import {SimpleButton} from "../../components/SimpleButton";
import {SimpleSnackbar} from "../../components/SimpleSnackbar";

export default function SignInScreen() {
  const { login, isAuthenticated, error } = useAuthStore();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      setVisible(false);
      router.replace('BiometricAuth');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      setVisible(true);
    }
  }, [error]);

  return (
    <View style={styles.externalContainer}>
      <View style={styles.container}>
        <Text variant="titleLarge" style={styles.title}>Iniciar sesión</Text>

        <TextInput
          label="Correo"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
        />

        <SimpleButton
          label="Ingresar"
          accent mode="contained"
          onPress={() => login(email, password)} />

        <SimpleButton
          label="Crear una cuenta"
          accent mode="contained"
          onPress={() => router.push('SignUp')} />

        <SimpleButton
          label="Olvidé mi contraseña"
          accent mode="contained"
          onPress={() => router.push('ForgotPassword')} />
      </View>
      <SimpleSnackbar mode="danger" text="Email o contraseña inválidos" closeLabel="OK" setVisible={setVisible} visible={visible} />
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
