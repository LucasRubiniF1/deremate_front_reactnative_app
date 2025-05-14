import {Text, View} from "react-native";
import AuthorizedRoute from "../components/AuthorizedRoute";
import {useRoute} from "@react-navigation/native";

export default function DeliveryDetailsScreen() {
  const route = useRoute()

  return (
    <AuthorizedRoute>
      <View>
        <Text>ID del delivery: {route.params?.deliveryId}</Text>
      </View>
    </AuthorizedRoute>
  )
}
