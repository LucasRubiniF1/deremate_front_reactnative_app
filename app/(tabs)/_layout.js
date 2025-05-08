import BottomTabsLayout from "../../src/components/BottomTabsLayout";
import {Slot, useSegments} from "expo-router";
import {StyleSheet, View} from "react-native";
import AuthorizedRoute from "../../src/components/AuthorizedRoute";

export default function TabsLayout() {
  const segments = useSegments();

  const currentRoute = `/${segments.join('/')}`;

  return (
    <AuthorizedRoute>
      <View style={styles.container}>
        <View style={styles.content}>
          <Slot />
        </View>

        {segments[0] === '(tabs)' && (
          <BottomTabsLayout currentRoute={currentRoute} />
        )}
      </View>
    </AuthorizedRoute>
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
