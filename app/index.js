import { View } from 'react-native';
import {useDecisionEngine} from "../src/hooks/useDecisionEngine";

export default function DecisionScreen() {
  useDecisionEngine()

  return (
    <View></View>
  );
}
