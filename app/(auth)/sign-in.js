import {useEffect, useState} from "react";
import {Button, SafeAreaView, TextInput} from "react-native";
import useAuthStore from "../../src/store/useAuthStore";
import {useRouter} from "expo-router";

export default function SignInScreen() {
  const { login, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('(tabs)/');
    }
  }, [isAuthenticated]);

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
