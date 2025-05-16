import { useRef, useState, useEffect } from 'react';
import { Text, TextInput, View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from '../../hooks/useRouter';
import useAuthStore from '../../store/useAuthStore';

export default function VerificationScreen() {
  const { verifyEmail, resendCode, error, isEmailVerified } = useAuthStore();
  const [code, setCode] = useState(['', '', '', '']);
  const [status, setStatus] = useState('default');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputsRef = useRef([]);
  const router = useRouter();

  useEffect(() => {
    let interval = null;
    if (resendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
      setTimer(60);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendDisabled, timer]);

  const handleChange = (text, index) => {
    if (!/^\d?$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    setStatus('default');

    if (text && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newCode.every((digit) => digit !== '')) {
      const fullCode = newCode.join('');
      verifyCode(fullCode);
    }
  };

  const verifyCode = async (fullCode) => verifyEmail(fullCode, isEmailVerified.email);

  useEffect(() => {
    if (error === null) return;

    if (error === "INCORRECT_CODE") {
      setStatus('error');
      return;
    };

    if (isEmailVerified.verified) {
      setStatus('success');
      setTimeout(() => {
        router.replace('BiometricAuth');
      }, 500);
    };

  }, [error, isEmailVerified])

  const handleResend = () => {
    if (resendDisabled) return;
    resendCode(isEmailVerified.email);
    setResendDisabled(true);
  };

  const getBorderColor = () => {
    if (status === 'success') return 'green';
    if (status === 'error') return 'red';
    return '#ccc';
  };

  const formatTimer = () => {
    const mins = String(Math.floor(timer / 60)).padStart(2, '0');
    const secs = String(timer % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verificá tu correo</Text>
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

      <TouchableOpacity onPress={handleResend} disabled={resendDisabled}>
        <Text
          style={[
            styles.resendText,
            { color: resendDisabled ? 'gray' : '#7C61CB' },
          ]}
        >
          {resendDisabled ? `Reenviar en ${formatTimer()}` : 'Reenviar código'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 24 },
  inputContainer: { flexDirection: 'row', gap: 10 },
  input: {
    borderWidth: 2,
    borderRadius: 6,
    fontSize: 24,
    padding: 10,
    width: 50,
    textAlign: 'center',
    marginHorizontal: 4,
  },
  resendText: {
    marginTop: 24,
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});
