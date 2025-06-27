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

export const getDeliveryById = async id => {
  try {
    const response = await AuthorizedService.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('[Package Service] Error fetching delivery detail:', {
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

export const getDeliveriesByUser = async () => {
  console.log('[Delivery Service] Fetching deliveries for current user');
  try {
    const response = await AuthorizedService.get(`${BASE_URL}/`);
    console.log('[Delivery Service] Deliveries fetched successfully:', {
      count: response.data.length,
      status: response.status,
    });
    return response.data;
  } catch (error) {
    console.error('[Delivery Service] Error fetching deliveries:', {
      error: {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      },
    });
    throw error;
  }
};

export const confirmDelivery = async (id, pin) => {
  const response = await AuthorizedService.put(`${BASE_URL}/${id}/confirm?pin=${pin}`);
  return response.data;
}
