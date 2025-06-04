import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native'; // Eliminado Text de aquí si no se usa directamente
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate que Ionicons esté disponible o cambia por MaterialCommunityIcons si es de Paper
// import useAccentColors from '../hooks/useAccentColors'; // Eliminado
import { useTheme, Text as PaperText } from 'react-native-paper'; // Importamos useTheme y Text de Paper

const tabs = [
  { name: 'Home', label: 'Inicio', icon: 'home' },
  { name: 'Orders', label: 'Pedidos', icon: 'cube' },
  { name: 'Scanner', label: 'Escaner', icon: 'scan' }, // Ionicons tiene 'scan', 'qr-code' o 'barcode'
  { name: 'Settings', label: 'Ajustes', icon: 'settings' },
  { name: 'Profile', label: 'Perfil', icon: 'person' },
];

// Convertimos styles en una función que acepta theme
const getThemedStyles = theme =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      height: 100,
      borderTopWidth: 1,
      borderTopColor: theme.colors.outlineVariant,
    },
    tab: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      marginBottom: 4,
    },
    label: {
      fontSize: 12,
      fontWeight: '500',
    },
  });

export default function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const theme = useTheme(); // Usamos el tema de Paper
  const styles = getThemedStyles(theme); // Creamos los estilos con el tema

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
          backgroundColor: theme.colors.primary, // Fondo del TabBar con el color primario del tema
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const tabConfig = tabs.find(t => t.name === route.name);
        if (!tabConfig) {
          console.warn(`No tab configuration found for route: ${route.name}`);
          return null; // O un placeholder
        }
        const isFocused = state.index === index;

        const animatedIconStyle = useAnimatedStyle(() => ({
          transform: [{ scale: withTiming(isFocused ? 1.2 : 1, { duration: 200 }) }],
          opacity: withTiming(isFocused ? 1 : 0.65, { duration: 200 }),
        }));

        const animatedLabelStyle = useAnimatedStyle(() => ({
          transform: [{ scale: withTiming(isFocused ? 1.05 : 1, { duration: 200 }) }],
          opacity: withTiming(isFocused ? 1 : 0.65, { duration: 200 }),
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
                name={isFocused ? tabConfig.icon : `${tabConfig.icon}-outline`}
                size={18}
                color={theme.colors.onPrimary}
                style={styles.icon}
              />
            </Animated.View>
            <Animated.View style={animatedLabelStyle}>
              <PaperText style={[styles.label, { color: theme.colors.onPrimary }]}>
                {tabConfig.label}
              </PaperText>
            </Animated.View>
          </Pressable>
        );
      })}
    </View>
  );
}
