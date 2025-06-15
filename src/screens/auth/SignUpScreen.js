import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { SimpleButton } from '../../components/SimpleButton';
import { useRouter } from '../../hooks/useRouter';
import { SimpleSnackbar } from '../../components/SimpleSnackbar';
import {
  validateEmail,
  validateName,
  validatePasswordsMatch,
  validatePasswordStrength,
} from '../../utils/validators';
import useAuthStore from '../../store/useAuthStore';
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
  });

export default function SignUpScreen() {
  console.log('[SignUpScreen] Component mounted');
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

  const theme = useTheme();
  const styles = getStyles(theme);

  const handleEmailChange = text => {
    console.log('[SignUpScreen] Email changed:', text);
    setEmail(text);
  };

  const handleFirstNameChange = text => {
    console.log('[SignUpScreen] First name changed:', text);
    setFirstName(text);
  };

  const handleLastNameChange = text => {
    console.log('[SignUpScreen] Last name changed:', text);
    setLastName(text);
  };

  const handlePasswordChange = text => {
    console.log('[SignUpScreen] Password changed');
    setPassword(text);
  };

  const handleConfirmPasswordChange = text => {
    console.log('[SignUpScreen] Confirm password changed');
    setConfirmPassword(text);
  };

  const handleSignUp = () => {
    console.log('[SignUpScreen] Sign up attempt initiated');
    const validations = [
      validateName(firstName),
      validateName(lastName, false),
      validateEmail(email),
      validatePasswordStrength(password),
      validatePasswordsMatch(password, confirmPassword),
    ];

    const errors = validations.filter(Boolean);

    if (errors.length) {
      console.log('[SignUpScreen] Validation errors:', errors);
      setSnackbarMode('danger');
      setSnackbarMessage(errors.join('\n'));
      setVisible(true);
      return;
    }

    console.log('[SignUpScreen] Validation successful, attempting sign up');
    signUp(email, password, firstName, lastName);
  };

  const handleBackToSignIn = () => {
    console.log('[SignUpScreen] Navigating back to sign in');
    router.replace('SignIn');
  };

  useEffect(() => {
    console.log('[SignUpScreen] Initial state:', {
      loading,
      error,
      isUserCreated,
    });

    return () => {
      console.log('[SignUpScreen] Component unmounting');
    };
  }, []);

  useEffect(() => {
    if (error) {
      console.log('[SignUpScreen] Error received:', error);
      setSnackbarMode('danger');
      setSnackbarMessage(error);
      setVisible(true);
    }
  }, [error]);

  useEffect(() => {
    if (isUserCreated) {
      console.log('[SignUpScreen] User created successfully, preparing redirect');
      setSnackbarMode('success');
      setSnackbarMessage('Cuenta creada exitosamente. Redirigiendo...');
      setVisible(true);

      const timeout = setTimeout(() => {
        console.log('[SignUpScreen] Redirecting to sign in screen');
        useAuthStore.setState({ isUserCreated: null });
        router.replace('SignIn');
      }, 2000);

      return () => {
        console.log('[SignUpScreen] Cleaning up redirect timeout');
        clearTimeout(timeout);
      };
    }
  }, [isUserCreated]);

  return (
    <View style={styles.externalContainer}>
      <View style={styles.container}>
        <Text variant="titleLarge" style={styles.title}>
          Crear cuenta
        </Text>

        <TextInput
          label="Correo"
          value={email}
          onChangeText={handleEmailChange}
          style={styles.input}
          mode="outlined"
          disabled={loading}
        />

        <TextInput
          label="Nombre"
          value={firstName}
          onChangeText={handleFirstNameChange}
          style={styles.input}
          mode="outlined"
          disabled={loading}
        />

        <TextInput
          label="Apellido"
          value={lastName}
          onChangeText={handleLastNameChange}
          style={styles.input}
          mode="outlined"
          disabled={loading}
        />

        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
          style={styles.input}
          mode="outlined"
          disabled={loading}
        />

        <TextInput
          label="Confirmar contraseña"
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          secureTextEntry
          style={styles.input}
          mode="outlined"
          disabled={loading}
        />

        <SimpleButton
          label="Registrarse"
          accent
          mode="contained"
          onPress={handleSignUp}
          disabled={loading}
        />

        <SimpleButton
          label="Ya tengo cuenta"
          accent
          mode="contained"
          onPress={handleBackToSignIn}
          disabled={loading}
        />
      </View>
      <SimpleSnackbar
        mode={snackbarMode}
        text={snackbarMessage}
        closeLabel="OK"
        setVisible={setVisible}
        visible={visible}
      />
    </View>
  );
}
