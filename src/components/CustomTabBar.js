import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import useAccentColors from '../hooks/useAccentColors';

const tabs = [
  { name: 'Home', label: 'Inicio', icon: 'home' },
  { name: 'Orders', label: 'Pedidos', icon: 'cube' },
  { name: 'Scanner', label: 'Escaner', icon: 'scan' },
  { name: 'Settings', label: 'Ajustes', icon: 'settings' },
  { name: 'Profile', label: 'Perfil', icon: 'person' },
];

export default function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const colors = useAccentColors();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom, backgroundColor: colors.primary }]}>
      {state.routes.map((route, index) => {
        const tab = tabs.find((t) => t.name === route.name);
        const isFocused = state.index === index;

        const animatedIconStyle = useAnimatedStyle(() => ({
          transform: [{ scale: withTiming(isFocused ? 1.2 : 1, { duration: 200 }) }],
          opacity: withTiming(isFocused ? 1 : 0.6, { duration: 200 }),
        }));

        const animatedLabelStyle = useAnimatedStyle(() => ({
          transform: [{ scale: withTiming(isFocused ? 1.05 : 1, { duration: 200 }) }],
          opacity: withTiming(isFocused ? 1 : 0.6, { duration: 200 }),
        }));

        return (
          <Pressable
            key={route.name}
            onPress={() => {
              if (!isFocused) navigation.navigate(route.name);
            }}
            style={styles.tab}
          >
            <Animated.View style={animatedIconStyle}>
              <Ionicons
                name={isFocused ? tab.icon : `${tab.icon}-outline`}
                size={28}
                color={isFocused ? '#FFFFFF' : '#A6A6A6'}
                style={styles.icon}
              />
            </Animated.View>
            <Animated.Text style={[styles.label, animatedLabelStyle, { color: isFocused ? '#FFFFFF' : '#A6A6A6' }]}>
              {tab.label}
            </Animated.Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 90,
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
