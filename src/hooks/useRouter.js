import { CommonActions, useNavigation } from '@react-navigation/native';
import { Log } from '../log/Log';

export const useRouter = () => {
  const navigation = useNavigation();

  const push = (name, params) => {
    Log.info('ROUTER', 'Going to', name);
    navigation.navigate(name, params);
  };

  const replace = (name, params) => {
    Log.info('ROUTER', 'Replacing with', name);
    navigation.dispatch(
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
  };

  const goBack = () => {
    Log.info('ROUTER', 'Going back');
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return {
    push,
    replace,
    goBack,
  };
};
