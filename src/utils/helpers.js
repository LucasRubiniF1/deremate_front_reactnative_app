export const status_map = status => {
  switch (status) {
    case 'NOT_DELIVERED':
      return 'Sin entregar';
    case 'DELIVERED':
      return 'Entregado';
    case 'REJECTED':
      return 'Cancelado';
    default:
      return status;
  }
};

export const getChipAppearance = (status, theme) => {
  switch (status) {
    case 'NOT_DELIVERED':
      return {
        backgroundColor: theme.colors.warning,
        textColor: theme.colors.onWarningContainer,
      };
    case 'DELIVERED':
      return {
        backgroundColor: theme.colors.successContainer,
        textColor: theme.colors.onSuccessContainer,
      };
    case 'REJECTED':
      return {
        backgroundColor: theme.colors.errorContainer,
        textColor: theme.colors.onErrorContainer,
      };

    default:
      return {
        backgroundColor: theme.colors.surfaceVariant,
        textColor: theme.colors.onSurfaceVariant,
      };
  }
};
