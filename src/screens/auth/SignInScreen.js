import { useEffect, useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { useRouter } from '../../hooks/useRouter';
import { Text, HelperText } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { SimpleButton } from '../../components/SimpleButton';
import { SimpleSnackbar } from '../../components/SimpleSnackbar';
import { useTheme } from 'react-native-paper';

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
      marginBottom: 24,
      fontWeight: 'bold',
    },
    input: {
      marginBottom: 16,
    },
    button: {
      marginVertical: 6,
      borderRadius: 8,
    },
  });

const TagMessage = ({ message, color }) => (
  <Text
    style={{
      backgroundColor: color.replace('rgb', 'rgba').replace(')', ',0.15)'),
      color,
      borderColor: color,
      borderWidth: 1,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 16,
      alignSelf: 'center',
      marginBottom: 12,
      fontSize: 12,
      fontWeight: '500',
      textAlign: 'center',
      width: '100%',
    }}
  >
    {message}
  </Text>
);

export default function SignInScreen() {
  console.log('[SignInScreen] Component mounted');
  const { login, isAuthenticated, error, setEmailVerified } = useAuthStore();
  const router = useRouter();
  const theme = useTheme();
  const styles = getStyles(theme);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Cleanup function
  const cleanupErrors = () => {
    console.log('[SignInScreen] Cleaning up errors');
    setVisible(false);
    setErrorMessage('');
  };

  // Reset state when component mounts
  useEffect(() => {
    console.log('[SignInScreen] Initializing component state');
    cleanupErrors();
    setEmail('');
    setPassword('');

    return () => {
      console.log('[SignInScreen] Component unmounting');
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      console.log('[SignInScreen] User authenticated, navigating to biometric auth');
      cleanupErrors();
      router.replace('BiometricAuth');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error === 'Account is already verified') {
      console.log('[SignInScreen] Account already verified, proceeding with login');
      login(email, password);
    } else if (error) {
      console.log('[SignInScreen] Error received:', error);
      setErrorMessage(error);
      setVisible(true);
    }
  }, [error]);

  const handleEmailChange = text => {
    console.log('[SignInScreen] Email changed:', text);
    cleanupErrors();
    setEmail(text);
  };

  const handlePasswordChange = text => {
    console.log('[SignInScreen] Password changed');
    cleanupErrors();
    setPassword(text);
  };

  const handleLogin = async () => {
    console.log('[SignInScreen] Login attempt initiated');
    cleanupErrors();

    if (!email.trim() || !password.trim()) {
      console.log('[SignInScreen] Login validation failed: empty fields');
      setErrorMessage('Debes ingresar tu correo y contraseña.');
      setVisible(true);
      return;
    }

    console.log('[SignInScreen] Attempting login for email:', email);
    const result = await login(email, password);

    if (result === 'EMAIL_NOT_VERIFIED') {
      console.log('[SignInScreen] Email not verified, navigating to verification screen');
      setEmailVerified({
        email,
        password,
        verified: false,
      });
      router.push('Verification');
    } else {
      console.log('[SignInScreen] Login result:', result);
    }
  };

  const handleSignUp = () => {
    console.log('[SignInScreen] Navigating to sign up screen');
    cleanupErrors();
    router.push('SignUp');
  };

  const handleForgotPassword = () => {
    console.log('[SignInScreen] Navigating to forgot password screen');
    cleanupErrors();
    router.push('ForgotPassword');
  };

  return (
    <View style={styles.externalContainer}>
      <View style={styles.container}>
        <Text variant="titleLarge" style={styles.title}>
          Iniciar sesión
        </Text>

        {errorMessage && <TagMessage message={errorMessage} color={'rgb(248, 113, 113)'} />}

        <TextInput
          label="Correo"
          value={email}
          onChangeText={handleEmailChange}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
          style={styles.input}
          mode="outlined"
        />

        <SimpleButton label="Ingresar" accent mode="contained" onPress={handleLogin} />

        <SimpleButton label="Crear una cuenta" accent mode="contained" onPress={handleSignUp} />

        <SimpleButton
          label="Olvidé mi contraseña"
          accent
          mode="contained"
          onPress={handleForgotPassword}
        />
      </View>
    </View>
  );
}











































































































