import { AuthorizedService } from "../api/apiClient";
import { getUserIdFromToken } from "../utils/secureStore";

const URL = "/v1/delivery";

export const getDeliveriesByUserId = async () => {
  console.log('[Delivery Service] Fetching deliveries for current user');
  try {
    const userId = await getUserIdFromToken();
    if (!userId) {
      throw new Error('No user ID found in token');
    }

    const response = await AuthorizedService.get(`${URL}/user/${userId}`);
    console.log('[Delivery Service] Deliveries fetched successfully:', {
      count: response.data.length,
      status: response.status
    });
    return response.data;
  } catch (error) {
    console.error('[Delivery Service] Error fetching deliveries:', {
      error: {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      }
    });
    throw error;
  }
}; 