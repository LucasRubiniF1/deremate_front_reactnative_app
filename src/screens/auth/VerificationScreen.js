import { useRef, useState, useEffect } from 'react';
import { Text, TextInput, View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from '../../hooks/useRouter';
import useAuthStore from '../../store/useAuthStore';
import { SimpleButton } from '../../components/SimpleButton';
import { IconButton } from 'react-native-paper';
import { SimpleSnackbar } from '../../components/SimpleSnackbar';
import { useTheme } from 'react-native-paper';

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: 20,
      marginBottom: 24,
      fontWeight: 'bold',
    },
    inputContainer: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 24,
    },
    input: {
      borderWidth: 2,
      borderRadius: 6,
      fontSize: 24,
      padding: 10,
      width: 50,
      textAlign: 'center',
      marginHorizontal: 4,
    },
    passwordContainer: {
      width: '100%',
      marginBottom: 24,
    },
    passwordInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    passwordInput: {
      flex: 1,
      borderWidth: 2,
      borderColor: '#ccc',
      borderRadius: 6,
      padding: 10,
      marginRight: 8,
    },
    eyeIcon: {
      margin: 0,
    },
    submitButton: {
      width: '100%',
      marginBottom: 12,
    },
    resendButton: {
      width: '100%',
      marginBottom: 12,
    },
    returnButton: {
      width: '100%',
    },
  });

export default function VerificationScreen({ route }) {
  console.log('[VerificationScreen] Component mounted with mode:', route?.params?.mode || 'email');
  const { mode = 'email', email: routeEmail } = route?.params || {};

  const { verifyEmail, resendCode, error, isEmailVerified, resetPassword } = useAuthStore();
  const [code, setCode] = useState(['', '', '', '']);
  const [status, setStatus] = useState('default');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const inputsRef = useRef([]);
  const router = useRouter();

  // Password validation regex
  const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

  // Cleanup function
  const cleanupErrors = () => {
    console.log('[VerificationScreen] Cleaning up errors');
    setErrorVisible(false);
    setErrorMessage('');
    setStatus('default');
  };

  // Reset state when component mounts or mode changes
  useEffect(() => {
    console.log('[VerificationScreen] Resetting state for mode:', mode);
    setCode(['', '', '', '']);
    cleanupErrors();
    setPassword('');
    setConfirmPassword('');
    setResendSuccess(false);

    return () => {
      console.log('[VerificationScreen] Component unmounting');
    };
  }, [mode]);

  useEffect(() => {
    if (error) {
      console.log('[VerificationScreen] Error received:', error);
      setErrorMessage(error);
      setErrorVisible(true);
      setStatus('error');
    }
  }, [error]);

  const getEmail = () => {
    const email = mode === 'email' ? isEmailVerified.email : routeEmail;
    console.log('[VerificationScreen] Getting email for mode:', mode, 'email:', email);
    return email;
  };

  const validatePassword = pass => {
    console.log('[VerificationScreen] Validating password');
    if (!PASSWORD_REGEX.test(pass)) {
      console.log('[VerificationScreen] Password validation failed');
      setErrorMessage('La contraseña debe tener al menos 6 caracteres, una mayúscula y un número');
      setErrorVisible(true);
      return false;
    }
    console.log('[VerificationScreen] Password validation successful');
    return true;
  };

  const handleChange = (text, index) => {
    // Only allow numbers
    if (!/^\d?$/.test(text)) return;

    console.log('[VerificationScreen] Code digit changed:', { index, value: text });
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    cleanupErrors();

    if (text && index < 3) {
      console.log('[VerificationScreen] Moving focus to next input');
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleSubmit = () => {
    console.log('[VerificationScreen] Submit initiated');
    cleanupErrors();
    const fullCode = code.join('');

    if (fullCode.length !== 4) {
      console.log('[VerificationScreen] Invalid code length:', fullCode.length);
      setErrorMessage('Por favor ingresa el código completo');
      setErrorVisible(true);
      return;
    }

    if (mode === 'email') {
      console.log('[VerificationScreen] Verifying email code');
      verifyCode(fullCode);
    } else if (mode === 'password') {
      console.log('[VerificationScreen] Verifying password reset');
      if (password !== confirmPassword) {
        console.log('[VerificationScreen] Passwords do not match');
        setErrorMessage('Las contraseñas no coinciden');
        setErrorVisible(true);
        return;
      }

      if (!validatePassword(password)) {
        return;
      }

      verifyPasswordReset(fullCode);
    }
  };

  const verifyCode = async fullCode => {
    console.log('[VerificationScreen] Verifying email code for:', getEmail());
    return verifyEmail(fullCode, getEmail());
  };

  const verifyPasswordReset = async fullCode => {
    console.log('[VerificationScreen] Verifying password reset for:', getEmail());
    const success = await resetPassword(getEmail(), fullCode, password);
    if (success) {
      console.log('[VerificationScreen] Password reset successful');
      Alert.alert('Éxito', 'Tu contraseña ha sido restablecida correctamente', [
        {
          text: 'OK',
          onPress: () => {
            console.log('[VerificationScreen] Navigating to SignIn after success message');
            router.replace('SignIn');
          },
        },
      ]);
    } else {
      console.log('[VerificationScreen] Password reset failed');
    }
  };

  const handleResendCode = async () => {
    console.log('[VerificationScreen] Resending code to:', getEmail());
    cleanupErrors();
    try {
      await resendCode(getEmail());
      console.log('[VerificationScreen] Code resent successfully');
      setResendSuccess(true);
    } catch (error) {
      console.error('[VerificationScreen] Error resending code:', error);
      setErrorMessage('Error al reenviar el código');
      setErrorVisible(true);
    }
  };

  const handleBackToSignIn = () => {
    console.log('[VerificationScreen] Navigating back to sign in');
    router.replace('SignIn');
  };

  const getBorderColor = () => {
    if (status === 'error' && error !== 'EMAIL_NOT_VERIFIED') return '#FF3B30';
    if (status === 'success') return '#34C759';
    if (isEmailVerified.verified) return '#34C759';
    return '#CCCCCC';
  };

  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {mode === 'email' ? 'Verificá tu correo' : 'Restablecer contraseña'}
      </Text>
      <View style={styles.inputContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => (inputsRef.current[index] = ref)}
            style={[styles.input, { borderColor: getBorderColor() }]}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={text => handleChange(text, index)}
          />
        ))}
      </View>

      {mode === 'password' && (
        <View style={styles.passwordContainer}>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Nueva contraseña"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <IconButton
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            />
          </View>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirmar contraseña"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <IconButton
              icon={showConfirmPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            />
          </View>
        </View>
      )}

      <SimpleButton
        label="Confirmar"
        accent
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
      />

      {mode === 'email' && (
        <SimpleButton
          label="Reenviar código"
          accent
          mode="contained"
          onPress={handleResendCode}
          style={styles.resendButton}
        />
      )}

      {mode === 'password' && (
        <SimpleButton
          label="Volver al inicio de sesión"
          accent
          mode="contained"
          onPress={handleBackToSignIn}
          style={styles.returnButton}
        />
      )}

      <SimpleSnackbar
        mode="info"
        text="Código reenviado exitosamente"
        closeLabel="OK"
        setVisible={setResendSuccess}
        visible={resendSuccess}
      />

      <SimpleSnackbar
        mode="danger"
        text={errorMessage}
        closeLabel="OK"
        setVisible={setErrorVisible}
        visible={errorVisible}
      />
    </View>
  );
}
