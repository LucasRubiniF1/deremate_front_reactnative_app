import { Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export const SimpleButton = ({ mode, style, accent = false, label, onPress }) => {
  return (
    <Button mode={mode} style={[styles.button, style, accent]} onPress={onPress}>
      {label}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 6,
    borderRadius: 8,
  },
});
