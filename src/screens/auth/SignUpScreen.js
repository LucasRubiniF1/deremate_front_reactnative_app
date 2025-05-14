import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { SimpleButton } from "../../components/SimpleButton";
import { useRouter } from "../../hooks/useRouter";
import { SimpleSnackbar } from "../../components/SimpleSnackbar";
import {
  validateEmail,
  validateName,
  validatePasswordsMatch,
  validatePasswordStrength
} from "../../utils/validators";

export default function SignUpScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignUp = () => {
  const validations = [
    validateName(firstName),
    validateName(lastName, false),
    validateEmail(email),
    validatePasswordStrength(password),
    validatePasswordsMatch(password, confirmPassword),
  ];

  const errors = validations.filter(Boolean); 

  if (errors.length) {
    setErrorMsg(errors.join('\n'));
    setVisible(true);
    return;
  }

  console.log({ email, firstName, password });
};

  return (
    <View style={styles.externalContainer}>
      <View style={styles.container}>
        <Text variant="titleLarge" style={styles.title}>Crear cuenta</Text>

        <TextInput
          label="Correo"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Nombre"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Apellido"
          value={lastName}
          onChangeText={setLastName}
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

        <TextInput
          label="Confirmar contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
        />

        <SimpleButton
          label="Registrarse"
          accent mode="contained"
          onPress={handleSignUp}
        />

        <SimpleButton
          label="Ya tengo cuenta"
          accent mode="contained"
          onPress={() => router.replace('SignIn')}
        />
      </View>
      <SimpleSnackbar mode="danger" text={errorMsg} closeLabel="OK" setVisible={setVisible} visible={visible} />
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
    marginBottom: 24,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
});
