import { useTheme } from 'react-native-paper';
import { getChipAppearance, status_map } from '../utils/helpers';
import { Chip } from 'react-native-paper';

const StatusChip = ({ status, styles }) => {
  const theme = useTheme();
  const chipAppearance = getChipAppearance(status, theme);

  return (
    <Chip
      style={[styles.chip, { backgroundColor: chipAppearance.backgroundColor }]}
      textStyle={[styles.chipText, { color: chipAppearance.textColor }]}
    >
      {status_map(status)}
    </Chip>
  );
};

export default StatusChip;
