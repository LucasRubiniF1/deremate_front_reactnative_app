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
    transparent: 'rgba(255,255,255,0)',
    background: '#FFFFFF',
    text: '#000000',
    border: '#D9D9D9',
  };
}
