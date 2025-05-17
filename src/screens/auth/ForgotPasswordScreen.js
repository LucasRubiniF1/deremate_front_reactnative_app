import { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { TextInput } from "react-native-paper";
import { SimpleButton } from "../../components/SimpleButton";
import { SimpleSnackbar } from "../../components/SimpleSnackbar";
import { useRouter } from "../../hooks/useRouter";
import useAuthStore from "../../store/useAuthStore";

// Test log to verify logging is working
console.log('=== FORGOT PASSWORD SCREEN LOADED ===');

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const { requestPasswordReset, loading, error } = useAuthStore();

  useEffect(() => {
    console.log('[ForgotPasswordScreen] Component mounted');
    return () => {
      console.log('[ForgotPasswordScreen] Component unmounted');
    };
  }, []);

  useEffect(() => {
    console.log('[ForgotPasswordScreen] Error state changed:', error);
    if (error) {
      console.log('[ForgotPasswordScreen] Showing error snackbar');
      setVisible(true);
    }
  }, [error]);

  useEffect(() => {
    console.log('[ForgotPasswordScreen] Loading state changed:', loading);
  }, [loading]);

  const handleSubmit = async () => {
    console.log('[ForgotPasswordScreen] Submit button pressed with email:', email);
    
    if (!email) {
      console.log('[ForgotPasswordScreen] Email is empty, showing error');
      setVisible(true);
      return;
    }

    console.log('[ForgotPasswordScreen] Calling requestPasswordReset...');
    const success = await requestPasswordReset(email);
    console.log('[ForgotPasswordScreen] requestPasswordReset result:', success);

    if (success) {
      console.log('[ForgotPasswordScreen] Navigating to Verification screen');
      router.push('Verification', { email, isPasswordReset: true });
    }
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
          onChangeText={(text) => {
            console.log('[ForgotPasswordScreen] Email input changed:', text);
            setEmail(text);
          }}
          style={styles.input}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          disabled={loading}
        />

        <SimpleButton
          label="Recuperar contraseña"
          accent
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
        />

        <SimpleButton
          label="Volver al inicio de sesión"
          accent
          mode="contained"
          onPress={() => {
            console.log('[ForgotPasswordScreen] Navigating back to SignIn');
            router.replace('SignIn');
          }}
          disabled={loading}
        />
      </View>
      <SimpleSnackbar 
        mode="danger" 
        text={error || 'Error al enviar el correo de recuperación'}
        closeLabel="OK" 
        setVisible={(value) => {
          console.log('[ForgotPasswordScreen] Snackbar visibility changed:', value);
          setVisible(value);
        }} 
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