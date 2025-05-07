import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native';

const TABS = [
  { name: 'index', label: 'Inicio', icon: 'home-outline' },
  { name: 'orders', label: 'Pedidos', icon: 'cube-outline' },
  { name: 'scanner', label: 'Escáner', icon: 'scan-outline' },
  { name: 'settings', label: 'Ajustes', icon: 'settings-outline' },
  { name: 'profile', label: 'Perfil', icon: 'person-outline' },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => {
        const currentTab = TABS.find(tab => tab.name === route.name);

        return {
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={currentTab?.icon} size={size} color={color} />
          ),
          tabBarLabel: ({ focused, color }) =>
            focused ? (
              <Text
                style={{
                  fontSize: 12,
                  color,
                  textAlign: 'center',
                  marginTop: 2,
                }}
              >
                {currentTab?.label}
              </Text>
            ) : null,
          tabBarActiveTintColor: '#D6336C', // rosa suave
          tabBarInactiveTintColor: '#333',
          tabBarStyle: {
            backgroundColor: '#FFEFF3', // fondo rosado claro
            borderTopWidth: 0,
            height: 60,
            paddingBottom: 6,
            paddingTop: 4,
          },
          headerShown: false,
        };
      }}
    />
  );
}
