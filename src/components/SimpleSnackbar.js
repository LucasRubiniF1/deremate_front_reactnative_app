import { Snackbar } from 'react-native-paper';

const COLORS = {
  info: '#3354d6',
  success: '#00ff00',
  warning: '#fff200',
  danger: '#ff0000',
};

export const SimpleSnackbar = ({
  mode = 'info',
  visible = false,
  setVisible,
  onPress,
  text,
  closeLabel = '',
}) => {
  return (
    <Snackbar
      visible={visible}
      style={{ backgroundColor: COLORS[mode] }}
      onDismiss={() => setVisible(false)}
      action={{
        label: closeLabel,
        onPress: onPress,
      }}
    >
      {text}
    </Snackbar>
  );
};
