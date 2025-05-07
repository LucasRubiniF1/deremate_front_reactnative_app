import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text, Provider as PaperProvider } from 'react-native-paper';
import useAuthStore from '../../src/store/useAuthStore';
import { useRouter } from 'expo-router';
import {SimpleButton} from "../../src/components/SimpleButton";
import {SimpleSnackbar} from "../../src/components/SimpleSnackbar";

export default function SignInScreen() {
  const { login, isAuthenticated, error } = useAuthStore();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      setVisible(false);
      router.replace('(tabs)/');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      setVisible(true);
    }
  }, [error]);

  return (
    <PaperProvider>
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
            onPress={() => router.push('/(auth)/sign-up')} />

          <SimpleButton
            label="Olvidé mi contraseña"
            accent mode="contained"
            onPress={() => router.push('/(auth)/forgot-password')} />
        </View>
        <SimpleSnackbar mode="danger" text="Email o contraseña inválidos" closeLabel="OK" setVisible={setVisible} visible={visible} />
      </View>
    </PaperProvider>
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
