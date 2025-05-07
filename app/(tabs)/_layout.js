import BottomTabsLayout from "../../src/components/BottomTabsLayout";
import {Slot, useSegments} from "expo-router";
import {StyleSheet, View} from "react-native";

export default function TabsLayout() {
  const segments = useSegments();

  const currentRoute = `/${segments.join('/')}`;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Slot />
      </View>

      {segments[0] === '(tabs)' && (
        <BottomTabsLayout currentRoute={currentRoute} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
