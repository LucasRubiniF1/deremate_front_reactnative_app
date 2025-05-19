import { useRef, useState, useEffect } from 'react';
import { Text, TextInput, View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from '../../hooks/useRouter';
import useAuthStore from '../../store/useAuthStore';
import { SimpleButton } from '../../components/SimpleButton';
import { IconButton } from 'react-native-paper';
import { SimpleSnackbar } from '../../components/SimpleSnackbar';

export default function VerificationScreen({ route }) {
  const { mode = 'email', email } = route?.params || {};
  console.log('[VerificationScreen] Mounted with mode:', mode, 'email:', email);
  const { verifyEmail, resendCode, error, isEmailVerified, resetPassword } = useAuthStore();
  const [code, setCode] = useState(['', '', '', '']);
  const [status, setStatus] = useState('default');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const inputsRef = useRef([]);
  const router = useRouter();

  // Reset state when component mounts
  useEffect(() => {
    console.log('[VerificationScreen] Resetting state for mode:', mode);
    setCode(['', '', '', '']);
    setStatus('default');
    setPassword('');
    setConfirmPassword('');
  }, [mode]);

  const handleChange = (text, index) => {
    if (!/^\d?$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    setStatus('default');

    if (text && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const fullCode = code.join('');
    console.log('[VerificationScreen] Submitting with mode:', mode);
    if (mode === 'email') {
      verifyCode(fullCode);
    } else if (mode === 'password' && password && confirmPassword) {
      verifyPasswordReset(fullCode);
    }
  };

  const verifyCode = async (fullCode) => verifyEmail(fullCode, isEmailVerified.email);

  const verifyPasswordReset = async (fullCode) => {
    if (password !== confirmPassword) {
      setStatus('error');
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    console.log('[VerificationScreen] Attempting password reset with code:', fullCode);
    const success = await resetPassword(email, fullCode, password);
    console.log('[VerificationScreen] Password reset result:', success);
    if (success) {
      console.log('[VerificationScreen] Password reset successful, showing success message');
      Alert.alert(
        'Éxito',
        'Tu contraseña ha sido restablecida correctamente',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('[VerificationScreen] Navigating to SignIn after success message');
              router.replace('SignIn');
            }
          }
        ]
      );
    }
  };

  useEffect(() => {
    console.log('[VerificationScreen] Error state changed:', error);
    if (error === null) return;

    if (mode === 'email') {
      if (error === "INCORRECT_CODE") {
        setStatus('error');
        return;
      }

      if (isEmailVerified.verified) {
        setStatus('success');
        setTimeout(() => {
          console.log('[VerificationScreen] Navigating to BiometricAuth after email verification');
          router.replace('BiometricAuth');
        }, 500);
      }
    } else if (mode === 'password') {
      if (error === "INCORRECT_CODE") {
        setStatus('error');
        Alert.alert('Error', 'Código incorrecto');
        return;
      }

      if (error === "Account is already verified") {
        console.log('[VerificationScreen] Account already verified, continuing with password reset');
        return;
      }

      if (error === "Password reset successful") {
        console.log('[VerificationScreen] Password reset successful, showing success message');
        Alert.alert(
          'Éxito',
          'Tu contraseña ha sido restablecida correctamente',
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('[VerificationScreen] Navigating to SignIn after success message');
                router.replace('SignIn');
              }
            }
          ]
        );
      }
    }
  }, [error, isEmailVerified]);

  const getBorderColor = () => {
    if (status === 'success') return 'green';
    if (status === 'error') return 'red';
    return '#ccc';
  };

  const handleResendCode = async () => {
    try {
      await resendCode(isEmailVerified.email);
      setResendSuccess(true);
    } catch (error) {
      console.error('[VerificationScreen] Resend code failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {mode === 'email' ? 'Verificá tu correo' : 'Restablecer contraseña'}
      </Text>
      <View style={styles.inputContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputsRef.current[index] = ref)}
            style={[styles.input, { borderColor: getBorderColor() }]}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
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
              icon={showPassword ? "eye-off" : "eye"}
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
              icon={showConfirmPassword ? "eye-off" : "eye"}
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
          onPress={() => router.replace('SignIn')}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 24,
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
