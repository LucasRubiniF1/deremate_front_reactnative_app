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

const getStyles = (theme) =>
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
  const [showServerErr, setShowServerErr] = useState(false);

  useEffect(() => {
    console.log(error);

    if (error) {
      setServerErr(error);
      setShowServerErr(true);
    }
  }, [error]);

  useEffect(() => {
    if (isUserCreated) router.replace('SignIn');
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
        {showServerErr && (
          <Banner
            visible
            icon="alert-circle"
            actions={[
              {
                label: 'Cerrar',
                onPress: () => setShowServerErr(false),
              },
            ]}
            style={{
              backgroundColor: theme.colors.errorContainer,
              borderRadius: 8,
              marginBottom: 16,
              alignSelf: 'center',
              maxWidth: 500,
              width: '100%',
            }}
          >
            {serverErr}
          </Banner>
        )}

        <Text variant="titleLarge" style={styles.title}>Crear cuenta</Text>

        <TextInput
          label="Correo"
          value={email}
          onChangeText={setEmail}
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
          onChangeText={setFirstName}
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
          onChangeText={setLastName}
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
          onChangeText={setPassword}
          onFocus={() => setPasswordTouched(true)}
          mode="outlined"
          style={styles.input}
          secureTextEntry
          error={passwordTouched && !!passwordErr}
          disabled={loading}
        />
        {passwordTouched && !!passwordErr && (
          <HelperText type="error" visible>
            {passwordErr}
          </HelperText>
        )}

        <TextInput
          label="Confirmar contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          onFocus={() => setConfirmTouched(true)}
          mode="outlined"
          style={styles.input}
          secureTextEntry
          error={confirmTouched && !!confirmErr}
          disabled={loading}
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
