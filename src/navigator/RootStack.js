import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DecisionScreen from "../screens/DecisionScreen";
import BiometricAuthScreen from "../screens/BiometricAuthScreen";
import AuthStack from "./AuthStack";
import MainTabsStack from "./MainTabs";
import DeliveryDetailsScreen from "../screens/DeliveryDetailsScreen";
import PackageDetailScreen from "../screens/PackageDetailScreen";
import { HeaderBackButton } from '@react-navigation/elements'; // 👈 agregado

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Decision" screenOptions={{ headerShown: false }} >
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="MainTabs" component={MainTabsStack} />
      <Stack.Screen name="Decision" component={DecisionScreen} />
      <Stack.Screen name="BiometricAuth" component={BiometricAuthScreen} />
      <Stack.Screen
        name="DeliveryDetails"
        component={DeliveryDetailsScreen}
        options={{ headerShown: true, title: "Detalles del Delivery" }}
      />
      <Stack.Screen
        name="PackageDetail"
        component={PackageDetailScreen}
        options={({ navigation }) => ({
          headerShown: true,
          title: "Detalle del Paquete",
          headerLeft: (props) => (
            <HeaderBackButton
              {...props}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
}
