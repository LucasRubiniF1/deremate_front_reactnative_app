import { AuthorizedService } from '../api/apiClient';

export const fetchPackagesInWarehouse = async () => {
    try {
        const response = await AuthorizedService.get('/delivery/warehouse');
        return response.data;
    } catch (error) {
        console.error('[Package Service] Error fetching warehouse packages:', error);
        throw error;
    }
};
