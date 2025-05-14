import {Text, View} from "react-native";
import AuthorizedRoute from "../../components/AuthorizedRoute";

export default function OrdersScreen() {
  return (
    <AuthorizedRoute>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Pedidos</Text>
      </View>
    </AuthorizedRoute>
  );
}
