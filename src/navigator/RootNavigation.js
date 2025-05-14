import {CommonActions, createNavigationContainerRef} from '@react-navigation/native';
import {Log} from "../log/Log";

export const navigationRef = createNavigationContainerRef();

export function push(name, params) {
  if (navigationRef.isReady()) {
    Log.info("ROUTER", "Going to", name);
    navigationRef.navigate(name, params);
  }
}

export function replace(name, params) {
  if (navigationRef.isReady()) {
    Log.info("ROUTER", "Replacing with", name);
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: name,
            params: params,
          },
        ],
      })
    );
  }
}
