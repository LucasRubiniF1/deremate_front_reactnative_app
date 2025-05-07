import {Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";
import useAccentColors from "../src/hooks/useAccentColors";

export default function RootLayout() {
  const colors = useAccentColors();

  return (
    <>
      <StatusBar
        backgroundColor={colors.primary}
        style="light"
      />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  )
}
