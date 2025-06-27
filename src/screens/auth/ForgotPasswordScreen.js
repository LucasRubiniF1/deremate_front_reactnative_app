import { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import { SimpleButton } from '../../components/SimpleButton';
import { SimpleSnackbar } from '../../components/SimpleSnackbar';
import { useRouter } from '../../hooks/useRouter';
import useAuthStore from '../../store/useAuthStore';
import { useTheme } from 'react-native-paper';

// Test log to verify logging is working
console.log('=== FORGOT PASSWORD SCREEN LOADED ===');

const getStyles = theme =>
  StyleSheet.create({
    externalContainer: {
      flex: 1,
      justifyContent: 'space-between',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 24,
      backgroundColor: theme.colors.background,
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

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { resetPasswordRequest, loading, error } = useAuthStore();

  const theme = useTheme();
  const styles = getStyles(theme);

  // Email validation regex
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Cleanup function
  const cleanupErrors = () => {
    setVisible(false);
    setErrorMessage('');
  };

  // Reset state when component mounts
  useEffect(() => {
    cleanupErrors();
    setEmail('');

    return () => {
    };
  }, []);

  useEffect(() => {
    if (error) {
      console.log('[ForgotPasswordScreen] Error received:', error);
      setErrorMessage(error);
      setVisible(true);
    }
  }, [error]);

  const validateEmail = email => {
    console.log('[ForgotPasswordScreen] Validating email:', email);
    if (!email) {
      console.log('[ForgotPasswordScreen] Email validation failed: empty email');
      setErrorMessage('Por favor ingresa tu correo electrónico');
      setVisible(true);
      return false;
    }
    if (!EMAIL_REGEX.test(email)) {
      console.log('[ForgotPasswordScreen] Email validation failed: invalid format');
      setErrorMessage('Por favor ingresa un correo electrónico válido');
      setVisible(true);
      return false;
    }
    console.log('[ForgotPasswordScreen] Email validation successful');
    return true;
  };

  const handleSubmit = async () => {
    console.log('[ForgotPasswordScreen] Submit initiated for email:', email);
    cleanupErrors();
    if (!validateEmail(email)) {
      return;
    }

    console.log('[ForgotPasswordScreen] Requesting password reset');
    const success = await resetPasswordRequest(email);

    if (success) {
      console.log(
        '[ForgotPasswordScreen] Password reset request successful, navigating to verification'
      );
      router.push('Verification', { mode: 'password', email });
    } else {
      console.log('[ForgotPasswordScreen] Password reset request failed');
    }
  };

  const handleEmailChange = text => {
    console.log('[ForgotPasswordScreen] Email changed:', text);
    cleanupErrors();
    setEmail(text);
  };

  const handleBackToSignIn = () => {
    console.log('[ForgotPasswordScreen] Navigating back to sign in');
    cleanupErrors();
    router.replace('SignIn');
  };

  return (
    <View style={styles.externalContainer}>
      <View style={styles.container}>
        <Text variant="titleLarge" style={styles.title}>
          Recuperar contraseña
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Ingresa tu correo electrónico y te enviaremos instrucciones para recuperar tu contraseña.
        </Text>

        <TextInput
          label="Correo"
          value={email}
          onChangeText={handleEmailChange}
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
          onPress={handleBackToSignIn}
          disabled={loading}
        />
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
