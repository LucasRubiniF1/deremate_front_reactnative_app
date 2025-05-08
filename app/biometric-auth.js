import {useEffect, useState} from "react";
import * as LocalAuthentication from "expo-local-authentication";
import {StyleSheet, View} from "react-native";
import {Icon, Text} from "react-native-paper";
import {useRouter} from "expo-router";
import useAccentColors from "../src/hooks/useAccentColors";
import {SimpleButton} from "../src/components/SimpleButton";
import useAuthStore from "../src/store/useAuthStore";
import Reanimated, {useAnimatedStyle, withSequence, withSpring, withTiming} from "react-native-reanimated";

const RESULT_ENUM = {
  CANCELLED: 'CANCELLED',
  DISABLED: 'DISABLED',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
}

const AnimatedView = Reanimated.createAnimatedComponent(View);

export default function BiometricAuthScreen() {
  const router = useRouter();
  const colors = useAccentColors();
  const { user, logout } = useAuthStore();

  const [facialRecognitionAvailable, setFacialRecognitionAvailable] = useState(false);
  const [fingerprintAvailable, setFingerprintAvailable] = useState(false);
  const [irisAvailable, setIrisAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  const checkSupportedAuthentication = async () => {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    if (types && types.length) {
      setFacialRecognitionAvailable(types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION));
      setFingerprintAvailable(types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT));
      setIrisAvailable(types.includes(LocalAuthentication.AuthenticationType.IRIS));
    }

    await authenticate()
  };

  const authenticate = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const results = await LocalAuthentication.authenticateAsync();

      if (results.success) {
        setResult(RESULT_ENUM.SUCCESS);

        setTimeout(() => {
          router.push("(tabs)/")
        }, 1000)
      } else if (results.error === 'unknown') {
        setResult(RESULT_ENUM.DISABLED);
      } else if (
        results.error === 'user_cancel' ||
        results.error === 'system_cancel' ||
        results.error === 'app_cancel'
      ) {
        setResult(RESULT_ENUM.CANCELLED);
      }
    } catch (error) {
      setResult(RESULT_ENUM.ERROR);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push('(auth)/sign-in');
  }

  const lockAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        scale: withSpring(result === undefined ? 1 : 0.5, {
          damping: 10,
          stiffness: 100,
        })
      }],
      opacity: withTiming(result === undefined ? 1 : 0, { duration: 300 })
    };
  });

  const unlockAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        scale: withSequence(
          withTiming(0, { duration: 0 }),
          withSpring(1.2, { damping: 10, stiffness: 100 }),
          withSpring(1, { damping: 10, stiffness: 100 })
        )
      }],
      opacity: withTiming(result === RESULT_ENUM.SUCCESS ? 1 : 0, { duration: 300 })
    };
  });

  useEffect(() => {
    checkSupportedAuthentication();
  }, []);

  return (
    <View style={styles.externalContainer}>
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        <Icon size={80} source="truck" color="white" />
        <Text variant="displayLarge" style={{ color: "white" }}>De Remate</Text>
      </View>
      <View style={styles.bottomContainer}>
        {!result && (
          <AnimatedView style={[styles.lockContainer, lockAnimatedStyle]}>
            <Icon size={80} source="lock" />
          </AnimatedView>
        )}

        {result === RESULT_ENUM.SUCCESS && (
          <AnimatedView style={[styles.lockContainer, unlockAnimatedStyle]}>
            <Icon size={80} source="lock-open-check" />
          </AnimatedView>
        )}

        {result === RESULT_ENUM.CANCELLED && (
          <>
            <View style={styles.bottomTopContainer}>
              <Icon size={80} source="shield-account-outline" />
              <Text variant="displaySmall" style={{ textAlign: "center" }}>Autenticate para desbloquear la app</Text>
            </View>
            <View style={styles.bottomActionsContainer}>
              <SimpleButton accent mode="contained" label="Autenticarme" style={{ width: "100%" }} onPress={() => authenticate()} />
              <View style={styles.bottomActionsSubContainer}>
                <Text variant="bodyMedium">{user?.email}</Text>
                <Text variant="bodyMedium" style={{ color: colors.primary, fontWeight: "bold" }} onPress={handleLogout}>Cerrar sesión</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  externalContainer: {
    flex: 1,
  },

  container: {
    gap: 10,
    paddingVertical: 100,
    paddingHorizontal: 30,
    alignItems: "center",
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
  },

  bottomContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },

  lockContainer: {
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  bottomTopContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  bottomActionsContainer: {
    gap: 10,
    alignItems: "center",
  },

  bottomActionsSubContainer: {
    paddingTop: 10,
    borderTopWidth: 1,
    width: "100%",
    borderColor: "#cfcfcf",
    alignItems: "center",
  }
})
