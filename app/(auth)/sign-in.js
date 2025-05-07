import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Provider as PaperProvider } from 'react-native-paper';
import useAuthStore from '../../src/store/useAuthStore';
import { useRouter } from 'expo-router';

export default function SignInScreen() {
  const { login, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('(tabs)/');
    }
  }, [isAuthenticated]);

  return (
    <PaperProvider>
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

        <Button
          mode="contained"
          onPress={() => login(email, password)}
          style={styles.button}
        >
          Ingresar
        </Button>

        <Button
          mode="contained"
          style={styles.button}
          onPress={() => router.push('/(auth)/sign-up')}
        >
          Crear una cuenta
        </Button>

        <Button
          mode="contained"
          style={styles.button}
          onPress={() => router.push('/(auth)/forgot-password')}
        >
          Olvidé mi contraseña
        </Button>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: '#7C61CB', // morado similar al de la imagen
  },
});
