import RootStack from "./src/navigator/RootStack";
import {NavigationContainer} from "@react-navigation/native";

export default function App() {
  return (
    <NavigationContainer >
      <RootStack />
    </NavigationContainer>
  );
}
