import * as SecureStore from 'expo-secure-store';

export async function saveToken(token) {
  await SecureStore.setItemAsync('userToken', token);
}

export async function getToken() {
  return await SecureStore.getItemAsync('userToken');
}

export async function deleteToken() {
  await SecureStore.deleteItemAsync('userToken');
}

// FCM Token functions
export async function saveFCMToken(token) {
  await SecureStore.setItemAsync('fcmToken', token);
}

export async function getFCMToken() {
  return await SecureStore.getItemAsync('fcmToken');
}

export async function deleteFCMToken() {
  await SecureStore.deleteItemAsync('fcmToken');
}

// Generic token functions
export async function saveTokenByKey(key, token) {
  await SecureStore.setItemAsync(key, token);
}

export async function getTokenByKey(key) {
  return await SecureStore.getItemAsync(key);
}

export async function deleteTokenByKey(key) {
  await SecureStore.deleteItemAsync(key);
}

export async function getUserIdFromToken() {
  try {
    const token = await getToken();
    if (!token) return null;

    // JWT tokens are in format: header.payload.signature
    const payload = token.split('.')[1];
    // Decode base64
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload.userId;
  } catch (error) {
    console.error('[SecureStore] Error decoding token:', error);
    return null;
  }
}
