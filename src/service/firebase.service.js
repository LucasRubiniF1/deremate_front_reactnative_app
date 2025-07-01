import { AuthorizedService } from '../api/apiClient';

const BASE_URL = '/v1/notification';

export const saveFirebaseDeviceToken = async token => {
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
