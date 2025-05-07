import {useRouter} from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import useAccentColors from "../hooks/useAccentColors";

const tabs = [
  { name: 'index', label: 'Inicio', icon: 'home' },
  { name: 'orders', label: 'Pedidos', icon: 'cube' },
  { name: 'scanner', label: 'Escaner', icon: 'scan' },
  { name: 'settings', label: 'Ajustes', icon: 'settings' },
  { name: 'profile', label: 'Perfil', icon: 'person' },
];

export default function BottomTabsLayout({ currentRoute }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useAccentColors();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom, backgroundColor: colors.primary }]}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.name}
          onPress={() => router.navigate(`/(tabs)/${tab.name === "index" ? "" : tab.name}`)}
          style={styles.tab}
        >
          <Ionicons
            name={currentRoute === `/(tabs)/${tab.name}` || tab.name === "index" && currentRoute === `/(tabs)` ? tab.icon : `${tab.icon}-outline`}
            size={28}
            color={currentRoute === `/(tabs)/${tab.name}` || tab.name === "index" && currentRoute === `/(tabs)` ? '#FFFFFF' : '#A6A6A6'}
            style={styles.icon}
          />
          <Text style={[
            styles.label,
            { color: currentRoute === `/(tabs)/${tab.name}` || tab.name === "index" && currentRoute === `/(tabs)` ? '#FFFFFF' : '#A6A6A6' }
          ]}>
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 84,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    includeFontPadding: false,
  },
});
