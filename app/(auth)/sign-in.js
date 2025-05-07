import {useState} from "react";
import {Button, SafeAreaView, TextInput} from "react-native";
import useAuthStore from "../../src/store/useAuthStore";

export default function SignInScreen() {
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={() => login(email, password)} />
    </SafeAreaView>
  )
}
