import { AuthorizedService } from '../api/apiClient';

const BASE_URL = '/v1/products';

export const fetchProductInfo = async productId => {
  try {
    const response = await AuthorizedService.get(`${BASE_URL}/${productId}`);
    return response.data;
  } catch (error) {
    console.error('[Package Service] Error fetching product info:', error);
    throw error;
  }
};
