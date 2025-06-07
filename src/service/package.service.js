import { AuthorizedService } from '../api/apiClient';

const BASE_URL = '/v1/delivery';

export const fetchPackagesInWarehouse = async () => {
  try {
    const response = await AuthorizedService.get(`${BASE_URL}/warehouse`);
    return response.data;
  } catch (error) {
    console.error('[Package Service] Error fetching warehouse packages:', error);
    throw error;
  }
};
