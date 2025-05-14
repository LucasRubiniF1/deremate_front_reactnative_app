import RootStack from "./src/navigator/RootStack";
import {NavigationContainer} from "@react-navigation/native";
import {PaperProvider} from "react-native-paper";

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer >
        <RootStack />
      </NavigationContainer>
    </PaperProvider>
  );
}
