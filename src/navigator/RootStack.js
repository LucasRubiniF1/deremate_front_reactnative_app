import {createNativeStackNavigator} from "@react-navigation/native-stack";
import DecisionScreen from "../screens/DecisionScreen";
import BiometricAuthScreen from "../screens/BiometricAuthScreen";
import AuthStack from "./AuthStack";
import MainTabsStack from "./MainTabs";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Decision" screenOptions={{ headerShown: false }} >
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="MainTabs" component={MainTabsStack} />
      <Stack.Screen name="Decision" component={DecisionScreen} />
      <Stack.Screen name="BiometricAuth" component={BiometricAuthScreen} />
    </Stack.Navigator>
  );
}
