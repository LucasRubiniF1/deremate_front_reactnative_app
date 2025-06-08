import { AuthorizedService } from '../api/apiClient';
import { getUserIdFromToken } from '../utils/secureStore';

const BASE_URL = '/v1/routes';

export const acceptRouteById = async id => {
  try {
    const response = await AuthorizedService.put(`${BASE_URL}/${id}/assign`);
    return response.data;
  } catch (error) {
    console.error('[Route Service] Error accepting route:', {
      id,
      error: {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      },
    });
    throw error;
  }
};
