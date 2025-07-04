import { AuthorizedService } from '../api/apiClient';

const BASE_URL = '/v1/notification';

/**
 * Guarda (linkea) el token del dispositivo con el usuario autenticado.
 * @param {string} token - Firebase Device Token (FCM).
 */
export const saveFirebaseDeviceToken = async (token) => {
  try {
    const response = await AuthorizedService.post(`${BASE_URL}/link-device`, {
      firebaseDeviceId: token,
    });
    return response.data;
  } catch (error) {
    console.error('[Firebase Service] Error saving Firebase device token:', error);
    throw error;
  }
};

/**
 * Elimina (unlinkea) el token del dispositivo del backend.
 * @param {string} token - Firebase Device Token (FCM) a desvincular.
 */
export const deleteFirebaseTokenOnServer = async (token) => {
  try {
    const response = await AuthorizedService.post(`${BASE_URL}/unlink-device`, {
      firebaseDeviceId: token,
    });
    return response.data;
  } catch (error) {
    console.error('[Firebase Service] Error deleting Firebase device token:', error);
    throw error;
  }
};
