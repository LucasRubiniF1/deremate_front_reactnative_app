import { CommonActions, createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();
const pendingActions = [];

export function replace(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name, params }],
      })
    );
  } else {
    pendingActions.push(() => replace(name, params));
  }
}

export function flushPendingActions() {
  if (navigationRef.isReady()) {
    while (pendingActions.length > 0) {
      const action = pendingActions.shift();
      action();
    }
  }
}
