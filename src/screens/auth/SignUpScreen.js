import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, HelperText, useTheme, Banner } from 'react-native-paper';
import { SimpleButton } from '../../components/SimpleButton';
import { useRouter } from '../../hooks/useRouter';
import {
  validateEmail,
  validateName,
  validatePasswordsMatch,
  validatePasswordStrength,
} from '../../utils/validators';
import useAuthStore from '../../store/useAuthStore';

const getStyles = theme =>
  StyleSheet.create({
    externalContainer: {
      flex: 1,
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
      marginBottom: 8,
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

export default function SignUpScreen() {
  const { signUp, loading, error, isUserCreated } = useAuthStore();
  const router = useRouter();
  const theme = useTheme();
  const styles = getStyles(theme);

  // Form fields
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Touched states
  const [emailTouched, setEmailTouched] = useState(false);
  const [firstNameTouched, setFirstNameTouched] = useState(false);
  const [lastNameTouched, setLastNameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  // Error messages
  const emailErr = validateEmail(email);
  const firstNameErr = validateName(firstName);
  const lastNameErr = validateName(lastName, false);
  const passwordErr = validatePasswordStrength(password);
  const confirmErr = validatePasswordsMatch(password, confirmPassword);

  const [serverErr, setServerErr] = useState('');
  const [showErr, setShowErr] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(prev => !prev);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(prev => !prev);

  useEffect(() => {
    if (error) {
      setServerErr(error);
      setShowErr(true);
    }
  }, [error]);

  useEffect(() => {
    if (isUserCreated) {
      setSuccessMsg('Cuenta creada exitosamente 🎉');
      setShowSuccess(true);

      const to = setTimeout(() => {
        useAuthStore.setState({ isUserCreated: null });
        setShowSuccess(false);
        router.replace('SignIn');
      }, 1500);

      return () => clearTimeout(to);
    }
  }, [isUserCreated, router]);

  const formHasErrors =
    !!emailErr ||
    !!firstNameErr ||
    !!lastNameErr ||
    !!passwordErr ||
    !!confirmErr ||
    !email ||
    !firstName ||
    !lastName ||
    !password ||
    !confirmPassword;

  const clearServerError = () => {
    if (showErr) {
      setShowErr(false);
      setServerErr('');
    }
  };

  const handleSignUp = () => {
    setEmailTouched(true);
    setFirstNameTouched(true);
    setLastNameTouched(true);
    setPasswordTouched(true);
    setConfirmTouched(true);

    if (formHasErrors) return;
    signUp(email, password, firstName, lastName);
  };

  return (
    <View style={styles.externalContainer}>
      <View style={styles.container}>
        <Text variant="titleLarge" style={styles.title}>
          Crear cuenta
        </Text>
        {showErr && <TagMessage message={serverErr} color={'rgb(248, 113, 113)'} />}
        {showSuccess && <TagMessage message={successMsg} color="rgb(34, 197, 94)" />}

        <TextInput
          label="Correo"
          value={email}
          onChangeText={t => {
            setEmail(t);
            clearServerError();
          }}
          onFocus={() => setEmailTouched(true)}
          autoCapitalize="none"
          keyboardType="email-address"
          mode="outlined"
          style={styles.input}
          error={emailTouched && !!emailErr}
          disabled={loading}
        />
        {emailTouched && !!emailErr && (
          <HelperText type="error" visible>
            {emailErr}
          </HelperText>
        )}

        <TextInput
          label="Nombre"
          value={firstName}
          onChangeText={t => {
            setFirstName(t);
            clearServerError();
          }}
          onFocus={() => setFirstNameTouched(true)}
          mode="outlined"
          style={styles.input}
          error={firstNameTouched && !!firstNameErr}
          disabled={loading}
        />
        {firstNameTouched && !!firstNameErr && (
          <HelperText type="error" visible>
            {firstNameErr}
          </HelperText>
        )}

        <TextInput
          label="Apellido"
          value={lastName}
          onChangeText={t => {
            setLastName(t);
            clearServerError();
          }}
          onFocus={() => setLastNameTouched(true)}
          mode="outlined"
          style={styles.input}
          error={lastNameTouched && !!lastNameErr}
          disabled={loading}
        />
        {lastNameTouched && !!lastNameErr && (
          <HelperText type="error" visible>
            {lastNameErr}
          </HelperText>
        )}

        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={t => {
            setPassword(t);
            clearServerError();
          }}
          onFocus={() => setPasswordTouched(true)}
          mode="outlined"
          style={styles.input}
          secureTextEntry={!showPassword}
          error={passwordTouched && !!passwordErr}
          disabled={loading}
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={toggleShowPassword}
              forceTextInputFocus={false}
            />
          }
        />
        {passwordTouched && !!passwordErr && (
          <HelperText type="error" visible>
            {passwordErr}
          </HelperText>
        )}

        <TextInput
          label="Confirmar contraseña"
          value={confirmPassword}
          onChangeText={t => {
            setConfirmPassword(t);
            clearServerError();
          }}
          onFocus={() => setConfirmTouched(true)}
          mode="outlined"
          style={styles.input}
          secureTextEntry={!showConfirmPassword}
          error={confirmTouched && !!confirmErr}
          disabled={loading}
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={toggleShowConfirmPassword}
              forceTextInputFocus={false}
            />
          }
        />
        {confirmTouched && !!confirmErr && (
          <HelperText type="error" visible>
            {confirmErr}
          </HelperText>
        )}

        <SimpleButton
          label="Registrarse"
          accent
          mode="contained"
          onPress={handleSignUp}
          disabled={loading || formHasErrors}
        />

        <SimpleButton
          label="Ya tengo cuenta"
          accent
          mode="contained"
          onPress={() => router.replace('SignIn')}
          disabled={loading}
        />
      </View>
    </View>
  );
}
