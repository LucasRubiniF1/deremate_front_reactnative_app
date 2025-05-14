import {useDecisionEngine} from "../hooks/useDecisionEngine";
import {View} from "react-native";

export default function DecisionScreen() {
  useDecisionEngine()

  return (
    <View></View>
  );
}
