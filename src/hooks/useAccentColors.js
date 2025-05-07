import { Platform } from 'react-native';

const DEFAULT_ACCENT = '#3354d6';

function getSystemAccentColor() {
  if (Platform.OS === 'android') {
    return DEFAULT_ACCENT;
  }
  return DEFAULT_ACCENT;
}

export default function useAccentColors() {
  const accent = getSystemAccentColor();

  return {
    primary: accent,
    primaryLight: accent + '33',
    primaryDark: accent,
    background: '#FFFFFF',
    text: '#000000',
    border: '#D9D9D9',
  };
}
